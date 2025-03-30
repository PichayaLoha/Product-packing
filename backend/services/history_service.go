package services

import (
	"database/sql"
	"fmt"
	"go-backend/models"
	"log"
)

func GetHistory(db *sql.DB) ([]models.History, error) {
	rows, err := db.Query(`
                SELECT 
                        po.package_id, 
                        po.package_amount, 
                        po.package_time, 
                        po.package_status,
						po.package_product_cost,
						po.package_box_cost,
						po.package_total_cost,
                        c.customer_firstname,
                        c.customer_lastname,
                        c.customer_address,
                        c.customer_postal,
                        c.customer_phone
                FROM packages_order po
                INNER JOIN customers c ON po.customer_id = c.customer_id
        `)
	if err != nil {
		log.Println("Error querying history: ", err)
		return nil, err
	}
	defer rows.Close()

	var history []models.History

	for rows.Next() {
		var history1 models.History
		if err := rows.Scan(
			&history1.HistoryID,
			&history1.HistoryAmount,
			&history1.HistoryTime,
			&history1.HistoryStatus,
			&history1.HistoryProductCost,
			&history1.HistoryBoxCost,
			&history1.HistoryTotalCost,
			&history1.CustomerFirstName,
			&history1.CustomerLastName,
			&history1.CustomerAddress,
			&history1.CustomerPostal,
			&history1.CustomerPhone,
		); err != nil {
			log.Println("Error scanning history row: ", err)
			return nil, err
		}
		history = append(history, history1)
	}

	return history, nil
}
func GetHistoryByID(db *sql.DB, historyID string) (models.History, error) {
	query := `
        SELECT
            ho.package_id,
            ho.package_amount,
            ho.package_time,
            ho.package_status,
			ho.package_product_cost,
			ho.package_box_cost,
			ho.package_total_cost,
            hd.package_del_id,
            hd.package_del_boxsize,
            bd.package_box_id,
            bd.package_box_x,
            bd.package_box_y,
            bd.package_box_z,
			bd.product_id
        FROM
            packages_order ho
        LEFT JOIN
            package_dels hd ON ho.package_id = hd.package_id
        LEFT JOIN
            package_box_dels bd ON hd.package_del_id = bd.package_del_id
        WHERE
            ho.package_id = $1;
    `

	rows, err := db.Query(query, historyID)

	if err != nil {
		log.Println("Error querying history: ", err)
		return models.History{}, err
	}
	defer rows.Close()

	history := models.History{}
	historyDelsMap := make(map[int]*models.HistoryDel)

	for rows.Next() {
		var (
			historyDelID      int
			historyDelBoxSize string
			genBoxDelID       sql.NullInt64
			genBoxDelX        sql.NullFloat64
			genBoxDelY        sql.NullFloat64
			genBoxDelZ        sql.NullFloat64
			productID         sql.NullString
		)

		err := rows.Scan(
			&history.HistoryID,
			&history.HistoryAmount,
			&history.HistoryTime,
			&history.HistoryStatus,
			&history.HistoryProductCost,
			&history.HistoryBoxCost,
			&history.HistoryTotalCost,
			&historyDelID,
			&historyDelBoxSize,
			&genBoxDelID,
			&genBoxDelX,
			&genBoxDelY,
			&genBoxDelZ,
			&productID,
			// &genProductName,
			// &genProductHeight,
			// &genProductLength,
			// &genProductWidth,
			// &genProductWeight,
		)
		if err != nil {
			log.Println("Error scanning history detail: ", err)
			return models.History{}, err
		}

		// ตรวจสอบว่า productID เป็น NULL หรือไม่
		if productID.Valid {
			// เรียกฟังก์ชัน GetProductsByID เพื่อดึงข้อมูลสินค้า
			hisroryboxdels, err := GetProductsByID(db, productID.String)
			if err != nil {
				log.Println("Error fetching hisroryboxdels: ", err)
				return models.History{}, err
			}

			// ตรวจสอบว่ามีสินค้าใน hisroryboxdels หรือไม่
			if len(hisroryboxdels) > 0 {
				hisroryboxdel := hisroryboxdels[0] // ใช้สินค้าแรกในรายการ (ถ้ามี)
				if _, exists := historyDelsMap[historyDelID]; !exists {
					historyDelsMap[historyDelID] = &models.HistoryDel{
						HistoryDelID:      historyDelID,
						HistoryDelBoxSize: historyDelBoxSize,
						GenBoxDels:        []models.GenBoxDel{},
					}
				}

				if genBoxDelID.Valid {
					genBoxDel := models.GenBoxDel{
						GenBoxDelID:     int(genBoxDelID.Int64),
						GenBoxDelX:      genBoxDelX.Float64,
						GenBoxDelY:      genBoxDelY.Float64,
						GenBoxDelZ:      genBoxDelZ.Float64,
						GenBoxDelName:   hisroryboxdel.ProductName,
						GenBoxDelHeight: hisroryboxdel.ProductHeight,
						GenBoxDelLength: hisroryboxdel.ProductLength,
						GenBoxDelWidth:  hisroryboxdel.ProductWidth,
						GenBoxDelWeight: hisroryboxdel.ProductWeight,
					}

					historyDelsMap[historyDelID].GenBoxDels = append(historyDelsMap[historyDelID].GenBoxDels, genBoxDel)
				}
			}
		}
	}

	// เพิ่ม HistoryDel เข้าไปใน History
	for _, historyDel := range historyDelsMap {
		history.HistoryDels = append(history.HistoryDels, *historyDel)
	}

	return history, nil
}

func GetHistoryBoxDetail(db *sql.DB, hisroryboxdelID string) ([]models.PackageDetail, error) {
	query := `SELECT 
		pbd.package_box_id, pbd.package_box_x, pbd.package_box_y, pbd.package_box_z,
		pd.package_del_id,
		b.box_id, b.box_name, b.box_width, b.box_length, b.box_height,
		p.product_id, p.product_name, p.product_width, p.product_length, p.product_height 
	FROM package_box_dels pbd
	JOIN package_dels pd ON pbd.package_del_id = pd.package_del_id
	JOIN boxes b ON pd.package_del_boxsize = b.box_name
	JOIN products p ON pbd.product_id = p.product_id
	WHERE pd.package_del_id = $1;`

	rows, err := db.Query(query, hisroryboxdelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var packageDetails []models.PackageDetail

	for rows.Next() {
		var detail models.PackageDetail
		if err := rows.Scan(
			&detail.PackageBoxID, &detail.PackageBoxX, &detail.PackageBoxY, &detail.PackageBoxZ,
			&detail.PackageDelID,
			&detail.BoxID, &detail.BoxName, &detail.BoxWidth, &detail.BoxLength, &detail.BoxHeight,
			&detail.ProductID, &detail.ProductName, &detail.ProductWidth, &detail.ProductLength, &detail.ProductHeight,
		); err != nil {
			return nil, err
		}
		packageDetails = append(packageDetails, detail)
	}

	return packageDetails, nil
}
func UpdateHistory(db *sql.DB, updatedHistory *models.HistoryOrder, historyID string) error {
	query := `UPDATE packages_order
			  SET package_status = $1
			  WHERE package_id = $2`
	_, err := db.Exec(query, updatedHistory.HistoryStatus, historyID)
	if err != nil {
		log.Println("Error updating history: ", err)
		return err
	}
	return nil
}

func DeleteHistory(db *sql.DB, packageID string) (int64, error) {
	tx, err := db.Begin() // ✅ เริ่ม transaction
	if err != nil {
		return 0, err
	}

	//ลบข้อมูลจาก package_box_dels ก่อน
	queryBoxDels := `DELETE FROM package_box_dels WHERE package_del_id IN 
                     (SELECT package_del_id FROM package_dels WHERE package_id = $1)`
	_, err = tx.Exec(queryBoxDels, packageID)
	if err != nil {
		tx.Rollback()
		log.Println("Error deleting from package_box_dels:", err)
		return 0, err
	}

	//ลบข้อมูลจาก package_dels
	queryDels := `DELETE FROM package_dels WHERE package_id = $1`
	_, err = tx.Exec(queryDels, packageID)
	if err != nil {
		tx.Rollback()
		log.Println("Error deleting from package_dels:", err)
		return 0, err
	}

	queryOrder := `DELETE FROM packages_order WHERE package_id = $1`
	result, err := tx.Exec(queryOrder, packageID)
	if err != nil {
		tx.Rollback()
		log.Println("Error deleting from packages_order:", err)
		return 0, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("Error getting rows affected:", err)
		return 0, err
	}

	if rowsAffected == 0 {
		log.Println("No history found for packageID:", packageID)
		return 0, fmt.Errorf("History not found")
	}

	// ✅ Commit การลบทั้งหมด
	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return rowsAffected, nil
}
