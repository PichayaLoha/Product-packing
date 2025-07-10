package services

import (
	"database/sql"
	"go-backend/models"
	"log"
	"time"
)

// HistoryResponse defines the structure for history data returned to the client.
type HistoryResponse struct {
	HistoryID          int       `json:"package_id"`
	HistoryAmount      int       `json:"package_amount"`
	HistoryTime        time.Time `json:"package_time"`
	HistoryStatus      string    `json:"package_status"`
	HistoryProductCost float64   `json:"package_product_cost"`
	HistoryBoxCost     float64   `json:"package_box_cost"`
	HistoryTotalCost   float64   `json:"package_total_cost"`
	CustomerID         int       `json:"customer_id"`
	CustomerFirstName  string    `json:"customer_first_name"`
	CustomerLastName   string    `json:"customer_last_name"`
	CustomerAddress    string    `json:"customer_address"`
	CustomerPostal     string    `json:"customer_postal"`
	CustomerPhone      string    `json:"customer_phone"`
	UserFirstName      string    `json:"user_first_name"`
	UserLastName       string    `json:"user_last_name"`
	HistoryUserID      int       `json:"package_user_id"`
}

// PackageDelResponse defines the structure for package delivery details.
type PackageDelResponse struct {
	PackageDelID      int                  `json:"package_del_id"`
	PackageDelBoxSize string               `json:"package_del_boxsize"`
	PackageID         int                  `json:"package_id"`
	Products          []PackageBoxResponse `json:"products"`
}

// PackageBoxResponse defines the structure for items within a package box.
type PackageBoxResponse struct {
	PackageBoxID  int     `json:"package_box_id"`
	PackageBoxX   float64 `json:"package_box_x"`
	PackageBoxY   float64 `json:"package_box_y"`
	PackageBoxZ   float64 `json:"package_box_z"`
	PackageDelID  int     `json:"package_del_id"`
	ProductID     int     `json:"product_id"`
	ProductName   string  `json:"product_name"`
	ProductWidth  float64 `json:"product_width"`
	ProductLength float64 `json:"product_length"`
	ProductHeight float64 `json:"product_height"`
	ProductImage  string  `json:"product_image"`
}

// GetHistory retrieves a list of all history records with joined data.
func GetHistory(db *sql.DB) ([]HistoryResponse, error) {
	rows, err := db.Query(`
        SELECT
            h.package_id, h.package_amount, h.package_time, h.package_status,
            h.package_product_cost, h.package_box_cost, h.package_total_cost,
            c.customer_id, c.customer_first_name, c.customer_last_name, c.customer_address, c.customer_postal, c.customer_phone,
            u.user_first_name, u.user_last_name, h.package_user_id
        FROM packages_order h
        JOIN customers c ON h.customer_id = c.customer_id
        JOIN users u ON h.package_user_id = u.user_id
        ORDER BY h.package_time DESC
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
            h.package_id, h.package_amount, h.package_time, h.package_status,
            h.package_product_cost, h.package_box_cost, h.package_total_cost,
            c.customer_id, c.customer_first_name, c.customer_last_name, c.customer_address, c.customer_postal, c.customer_phone,
            u.user_first_name, u.user_last_name, h.package_user_id
        FROM packages_order h
        JOIN customers c ON h.customer_id = c.customer_id
        JOIN users u ON h.package_user_id = u.user_id
        WHERE h.package_id = $1
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
            pbd.package_del_id, p.product_id, p.product_name, p.product_width, p.product_length, p.product_height, p.product_image
        FROM package_box_dels pbd
        JOIN products p ON pbd.product_id = p.product_id
        WHERE pbd.package_del_id = $1
    `, historyBoxDelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var boxDetails []PackageBoxResponse
	for rows.Next() {
		var bd PackageBoxResponse
		if err := rows.Scan(
			&bd.PackageBoxID, &bd.PackageBoxX, &bd.PackageBoxY, &bd.PackageBoxZ,
			&bd.PackageDelID, &bd.ProductID, &bd.ProductName, &bd.ProductWidth, &bd.ProductLength, &bd.ProductHeight, &bd.ProductImage,
		); err != nil {
			return nil, err
		}
		boxDetails = append(boxDetails, bd)
	}
	return boxDetails, nil
}

// UpdateHistory updates the status of a history record.
func UpdateHistory(db *sql.DB, historyID string, status string) error {
	_, err := db.Exec("UPDATE packages_order SET package_status = $1 WHERE package_id = $2", status, historyID)
	return err
}

// DeleteHistory deletes a history record and its associated data.
func DeleteHistory(db *sql.DB, historyID string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	// First, get all package_del_ids associated with the historyID
	rows, err := tx.Query("SELECT package_del_id FROM package_dels WHERE package_id = $1", historyID)
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
	_, err = tx.Exec("DELETE FROM package_dels WHERE package_id = $1", historyID)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Finally, delete from packages_order
	_, err = tx.Exec("DELETE FROM packages_order WHERE package_id = $1", historyID)
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
	tx, err := db.Begin()
	if err != nil {
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

	insertHistoryQuery := `INSERT INTO packages_order (package_amount, package_time, package_status, package_product_cost, package_box_cost, package_total_cost, customer_id, package_user_id)
                           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING package_id`
	err = tx.QueryRow(insertHistoryQuery,
		history.HistoryAmount, history.HistoryTime, history.HistoryStatus,
		history.HistoryProductCost, history.HistoryBoxCost, history.HistoryTotalCost,
		history.CustomerID, history.HistoryUserID).Scan(&history.HistoryID)
	if err != nil {
		log.Printf("Error inserting history: %v", err)
		return 0, err
	}

	// 2. Insert into package_dels and package_box_dels
	for _, solution := range packingResult.Solutions {
		packageDel := models.PackageDel{
			PackageDelBoxSize: solution.BoxName, // Assuming BoxName can be used as size description
			PackageID:         history.HistoryID,
		}
		insertPackageDelQuery := `INSERT INTO package_dels (package_del_boxsize, package_id)
                                  VALUES ($1, $2) RETURNING package_del_id`
		err = tx.QueryRow(insertPackageDelQuery, packageDel.PackageDelBoxSize, packageDel.PackageID).Scan(&packageDel.PackageDelID)
		if err != nil {
			log.Printf("Error inserting package_del: %v", err)
			return 0, err
		}

		for _, product := range solution.PackedProducts {
			packageBoxDel := models.PackageBoxDel{
				PackageBoxX:  0, // Placeholder, actual coordinates would come from packing algorithm
				PackageBoxY:  0, // Placeholder
				PackageBoxZ:  0, // Placeholder
				PackageDelID: packageDel.PackageDelID,
				ProductID:    product.ProductID,
			}
			insertPackageBoxDelQuery := `INSERT INTO package_box_dels (package_box_x, package_box_y, package_box_z, package_del_id, product_id)
                                          VALUES ($1, $2, $3, $4, $5)`
			_, err = tx.Exec(insertPackageBoxDelQuery,
				packageBoxDel.PackageBoxX, packageBoxDel.PackageBoxY, packageBoxDel.PackageBoxZ,
				packageBoxDel.PackageDelID, packageBoxDel.ProductID)
			if err != nil {
				log.Printf("Error inserting package_box_del: %v", err)
				return 0, err
			}
		}
	}

	return history.HistoryID, tx.Commit()
}