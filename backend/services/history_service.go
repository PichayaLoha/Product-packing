package services

import (
	"database/sql"
	"go-backend/models"
	"log"
	"time"
)

// HistoryResponse defines the structure for history data returned to the client.
type HistoryResponse struct {
	HistoryID          int       `json:"history_id"`
	HistoryAmount      int       `json:"history_amount"`
	HistoryTime        time.Time `json:"history_time"`
	HistoryStatus      string    `json:"history_status"`
	HistoryProductCost float64   `json:"history_product_cost"`
	HistoryBoxCost     float64   `json:"history_box_cost"`
	HistoryTotalCost   float64   `json:"history_total_cost"`
	CustomerID         int       `json:"customer_id"`
	CustomerFirstName  string    `json:"customer_first_name"`
	CustomerLastName   string    `json:"customer_last_name"`
	CustomerAddress    string    `json:"customer_address"`
	CustomerPostal     string    `json:"customer_postal"`
	CustomerPhone      string    `json:"customer_phone"`
	UserFirstName      string    `json:"user_first_name"`
	UserLastName       string    `json:"user_last_name"`
	HistoryUserID      int       `json:"history_user_id"`
}

// PackageDelResponse defines the structure for package delivery details.
type PackageDelResponse struct {
	PackageDelID      int                  `json:"package_del_id"`
	PackageDelBoxSize string               `json:"package_del_box_size"`
	PackageID         int                  `json:"package_id"`
	Products          []PackageBoxResponse `json:"products"`
}

// PackageBoxResponse defines the structure for items within a package box.
type PackageBoxResponse struct {
	PackageBoxID int     `json:"package_box_id"`
	PackageBoxX  float64 `json:"package_box_x"`
	PackageBoxY  float64 `json:"package_box_y"`
	PackageBoxZ  float64 `json:"package_box_z"`
	PackageDelID int     `json:"package_del_id"`

	BoxID     int     `json:"box_id"`     // เพิ่ม
	BoxName   string  `json:"box_name"`   // เพิ่ม
	BoxWidth  float64 `json:"box_width"`  // เพิ่ม
	BoxLength float64 `json:"box_length"` // เพิ่ม
	BoxHeight float64 `json:"box_height"` // เพิ่ม

	ProductID     int     `json:"product_id"`
	ProductName   string  `json:"product_name"`
	ProductWidth  float64 `json:"product_width"`
	ProductLength float64 `json:"product_length"`
	ProductHeight float64 `json:"product_height"`
	ProductImage  string  `json:"product_image"`

	UserFirstName string `json:"user_first_name"` // เพิ่ม
	UserLastName  string `json:"user_last_name"`  // เพิ่ม
}

// GetHistory retrieves a list of all history records with joined data.
func GetHistory(db *sql.DB) ([]HistoryResponse, error) {
	rows, err := db.Query(`
        SELECT
            h.history_id, h.history_amount, h.history_time, h.history_status,
            h.history_product_cost, h.history_box_cost, h.history_total_cost,
            c.customer_id, c.customer_first_name, c.customer_last_name, c.customer_address, c.customer_postal, c.customer_phone,
            u.user_first_name, u.user_last_name, h.history_user_id
        FROM packages_order h
        JOIN customers c ON h.customer_id = c.customer_id
        JOIN users u ON h.history_user_id = u.user_id
        ORDER BY h.history_time DESC
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var histories []HistoryResponse
	for rows.Next() {
		var h HistoryResponse
		if err := rows.Scan(
			&h.HistoryID, &h.HistoryAmount, &h.HistoryTime, &h.HistoryStatus,
			&h.HistoryProductCost, &h.HistoryBoxCost, &h.HistoryTotalCost,
			&h.CustomerID, &h.CustomerFirstName, &h.CustomerLastName, &h.CustomerAddress, &h.CustomerPostal, &h.CustomerPhone,
			&h.UserFirstName, &h.UserLastName, &h.HistoryUserID,
		); err != nil {
			return nil, err
		}
		histories = append(histories, h)
	}
	return histories, nil
}

// GetHistoryDetail retrieves a single history record and its associated details.
func GetHistoryDetail(db *sql.DB, historyID string) (*HistoryResponse, error) {
	var h HistoryResponse
	err := db.QueryRow(`
        SELECT
            h.history_id, h.history_amount, h.history_time, h.history_status,
            h.history_product_cost, h.history_box_cost, h.history_total_cost,
            c.customer_id, c.customer_first_name, c.customer_last_name, c.customer_address, c.customer_postal, c.customer_phone,
            u.user_first_name, u.user_last_name, h.history_user_id
        FROM packages_order h
        JOIN customers c ON h.customer_id = c.customer_id
        JOIN users u ON h.history_user_id = u.user_id
        WHERE h.history_id = $1
    `, historyID).Scan(
		&h.HistoryID, &h.HistoryAmount, &h.HistoryTime, &h.HistoryStatus,
		&h.HistoryProductCost, &h.HistoryBoxCost, &h.HistoryTotalCost,
		&h.CustomerID, &h.CustomerFirstName, &h.CustomerLastName, &h.CustomerAddress, &h.CustomerPostal, &h.CustomerPhone,
		&h.UserFirstName, &h.UserLastName, &h.HistoryUserID,
	)
	if err != nil {
		return nil, err
	}
	return &h, nil
}

// GetHistoryBoxDetail retrieves the details of a specific box in a package delivery.
func GetHistoryBoxDetail(db *sql.DB, historyBoxDelID string) ([]PackageBoxResponse, error) {
	rows, err := db.Query(`
       SELECT 
		pbd.package_box_id, pbd.package_box_x, pbd.package_box_y, pbd.package_box_z,
		pd.package_del_id,
		b.box_id, b.box_name, b.box_width, b.box_length, b.box_height,
		p.product_id, p.product_name, p.product_width, p.product_length, p.product_height, p.product_image,
		u.user_firstname, u.user_lastname  -- ✅ เพิ่มชื่อผู้ใช้
	FROM package_box_dels pbd
	JOIN package_dels pd ON pbd.package_del_id = pd.package_del_id
	JOIN boxes b ON pd.package_del_box_size = b.box_name
	JOIN products p ON pbd.product_id = p.product_id
	JOIN packages_order ho ON pd.package_id = ho.package_id  -- ✅ เพิ่มเพื่อดึง package_user_id
	JOIN users u ON ho.package_user_id = u.user_id  -- ✅ เชื่อม users
	WHERE pd.package_del_id = $1;`, historyBoxDelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var boxDetails []PackageBoxResponse
	for rows.Next() {
		var bd PackageBoxResponse
		if err := rows.Scan(
			&bd.PackageBoxID, &bd.PackageBoxX, &bd.PackageBoxY, &bd.PackageBoxZ,
			&bd.PackageDelID,
			&bd.BoxID, &bd.BoxName, &bd.BoxWidth, &bd.BoxLength, &bd.BoxHeight,
			&bd.ProductID, &bd.ProductName, &bd.ProductWidth, &bd.ProductLength, &bd.ProductHeight, &bd.ProductImage,
			&bd.UserFirstName, &bd.UserLastName, // ✅ อ่านค่าชื่อผู้ใช้
		); err != nil {
			return nil, err
		}
		boxDetails = append(boxDetails, bd)
	}
	return boxDetails, nil
}

// UpdateHistory updates the status of a history record.
func UpdateHistory(db *sql.DB, historyID string, status string) error {
	_, err := db.Exec("UPDATE packages_order SET history_status = $1 WHERE history_id = $2", status, historyID)
	return err
}

// DeleteHistory deletes a history record and its associated data.
func DeleteHistory(db *sql.DB, historyID string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	// First, get all package_del_ids associated with the historyID
	rows, err := tx.Query("SELECT package_del_id FROM package_dels WHERE history_id = $1", historyID)
	if err != nil {
		tx.Rollback()
		return err
	}
	defer rows.Close()

	var delIDs []int
	for rows.Next() {
		var id int
		if err := rows.Scan(&id); err != nil {
			tx.Rollback()
			return err
		}
		delIDs = append(delIDs, id)
	}

	// Delete from package_box_dels for each package_del_id
	for _, id := range delIDs {
		_, err := tx.Exec("DELETE FROM package_box_dels WHERE package_del_id = $1", id)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	// Delete from package_dels
	_, err = tx.Exec("DELETE FROM package_dels WHERE history_id = $1", historyID)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Finally, delete from packages_order
	_, err = tx.Exec("DELETE FROM packages_order WHERE history_id = $1", historyID)
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}

// CreateHistoryFromOrder creates a new history record from a generated order.
// NOTE: This function's signature and implementation depend on the `ordergen_service` which is also being refactored.
// This is a placeholder implementation.
func CreateHistoryFromOrder(db *sql.DB, packingResult *PackingResult, userID int, customerID int) (int, error) {
	log.Printf("CreateHistoryFromOrder called for userID: %d, customerID: %d", userID, customerID)
	tx, err := db.Begin()
	if err != nil {
		log.Printf("Error beginning transaction: %v", err)
		return 0, err
	}
	defer tx.Rollback() // Rollback on error

	// 1. Insert into packages_order
	history := models.History{
		HistoryAmount:      len(packingResult.Solutions), // Number of boxes packed
		HistoryTime:        time.Now(),
		HistoryStatus:      string(models.Packed),
		HistoryProductCost: 0, // Will calculate from packed products
		HistoryBoxCost:     0, // Will calculate from packed boxes
		HistoryTotalCost:   packingResult.OverallTotalCost,
		CustomerID:         customerID,
		HistoryUserID:      userID,
	}

	// Calculate total product cost and box cost
	for _, solution := range packingResult.Solutions {
		history.HistoryBoxCost += solution.BoxCost
		history.HistoryProductCost += solution.TotalProductCost
	}

	log.Printf("Attempting to insert history record: %+v", history)
	insertHistoryQuery := `INSERT INTO packages_order (history_amount, history_time, history_status, history_product_cost, history_box_cost, history_total_cost, customer_id, history_user_id)
                           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING history_id`
	err = tx.QueryRow(insertHistoryQuery,
		history.HistoryAmount, history.HistoryTime, history.HistoryStatus,
		history.HistoryProductCost, history.HistoryBoxCost, history.HistoryTotalCost,
		history.CustomerID, history.HistoryUserID).Scan(&history.HistoryID)
	if err != nil {
		log.Printf("Error inserting history: %v", err)
		return 0, err
	}
	log.Printf("History record inserted with ID: %d", history.HistoryID)

	// 2. Insert into package_dels and package_box_dels
	for _, solution := range packingResult.Solutions {
		packageDel := models.PackageDel{
			PackageDelBoxSize: solution.BoxName, // Assuming BoxName can be used as size description
			PackageID:         history.HistoryID,
		}
		log.Printf("Attempting to insert package_del: %+v", packageDel)
		insertPackageDelQuery := `INSERT INTO package_dels (package_del_box_size, package_id)
                                  VALUES ($1, $2) RETURNING package_del_id`
		err = tx.QueryRow(insertPackageDelQuery, packageDel.PackageDelBoxSize, packageDel.PackageID).Scan(&packageDel.PackageDelID)
		if err != nil {
			log.Printf("Error inserting package_del: %v", err)
			return 0, err
		}
		log.Printf("PackageDel inserted with ID: %d", packageDel.PackageDelID)

		for _, product := range solution.PackedProducts {
			packageBoxDel := models.PackageBoxDel{
				PackageBoxX:  0, // Placeholder, actual coordinates would come from packing algorithm
				PackageBoxY:  0, // Placeholder
				PackageBoxZ:  0, // Placeholder
				PackageDelID: packageDel.PackageDelID,
				ProductID:    product.ProductID,
			}
			log.Printf("Attempting to insert package_box_del: %+v", packageBoxDel)
			insertPackageBoxDelQuery := `INSERT INTO package_box_dels (package_box_x, package_box_y, package_box_z, package_del_id, product_id)
                                          VALUES ($1, $2, $3, $4, $5)`
			_, err = tx.Exec(insertPackageBoxDelQuery,
				packageBoxDel.PackageBoxX, packageBoxDel.PackageBoxY, packageBoxDel.PackageBoxZ,
				packageBoxDel.PackageDelID, packageBoxDel.ProductID)
			if err != nil {
				log.Printf("Error inserting package_box_del: %v", err)
				return 0, err
			}
			log.Printf("PackageBoxDel inserted for ProductID: %d", product.ProductID)
		}
	}

	log.Println("Committing transaction.")
	return history.HistoryID, tx.Commit()
}
