package services

import (
	"database/sql"
	"fmt"
	"go-backend/models"
	"log"
)

func GetHistory(db *sql.DB) ([]models.History, error) {
	rows, err := db.Query(`SELECT package_id, package_amount, package_time, package_status FROM packages_order`)
	if err != nil {
		log.Println("Error querying history: ", err)
		return nil, err
	}
	defer rows.Close()

	var history []models.History

	for rows.Next() {
		var history1 models.History
		if err := rows.Scan(&history1.HistoryID, &history1.HistoryAmount, &history1.HistoryTime, &history1.HistoryStatus); err != nil {
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
			productID         string
			// genProductName    sql.NullString
			// genProductHeight  sql.NullFloat64
			// genProductLength  sql.NullFloat64
			// genProductWidth   sql.NullFloat64
			// genProductWeight  sql.NullFloat64
		)

		err := rows.Scan(
			&history.HistoryID,
			&history.HistoryAmount,
			&history.HistoryTime,
			&history.HistoryStatus, // เพิ่มตรงนี้
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

		products, err := GetProductsByID(db, productID)
		if err != nil {
			log.Println("Error fetching products: ", err)
			return models.History{}, err
		}
		defer products.Close()
		var product models.Product
		for products.Next() {

			if err := products.Scan(&product.ProductID, &product.ProductName, &product.ProductHeight, &product.ProductLength, &product.ProductWidth, &product.ProductTime, &product.ProductAmount, &product.ProductWeight, &product.UserId); err != nil {
				log.Println("Error scanning product row: ", err)
				return models.History{}, err
			}
			fmt.Printf("Product: ID=%d, Name=%s\n", product.ProductID, product.ProductName)
		}
		if _, exists := historyDelsMap[historyDelID]; !exists {
			historyDelsMap[historyDelID] = &models.HistoryDel{
				HistoryDelID:      historyDelID,
				HistoryDelBoxSize: historyDelBoxSize,
				GenBoxDels:        []models.GenBoxDel{},
			}
		}

		if genBoxDelID.Valid {
			genBoxDel := models.GenBoxDel{
				GenBoxDelID: int(genBoxDelID.Int64),

				GenBoxDelX:      genBoxDelX.Float64,
				GenBoxDelY:      genBoxDelY.Float64,
				GenBoxDelZ:      genBoxDelZ.Float64,
				GenBoxDelName:   product.ProductName,
				GenBoxDelHeight: product.ProductHeight,
				GenBoxDelLength: product.ProductLength,
				GenBoxDelWidth:  product.ProductWidth,
			}

			// if genProductName.Valid {
			// 	genBoxDel.GenBoxDelName = genProductName.String
			// }
			// if genProductHeight.Valid {
			// 	genBoxDel.GenBoxDelHeight = genProductHeight.Float64
			// }
			// if genProductLength.Valid {
			// 	genBoxDel.GenBoxDelLength = genProductLength.Float64
			// }
			// if genProductWidth.Valid {
			// 	genBoxDel.GenBoxDelWidth = genProductWidth.Float64
			// }
			// if genProductWeight.Valid {
			// 	genBoxDel.GenBoxDelWeight = genProductWeight.Float64
			// }

			historyDelsMap[historyDelID].GenBoxDels = append(historyDelsMap[historyDelID].GenBoxDels, genBoxDel)
		}
	}

	for _, historyDel := range historyDelsMap {
		history.HistoryDels = append(history.HistoryDels, *historyDel)
	}

	return history, nil
}
func UpdateHistory(db *sql.DB, updatedHistory *models.HistoryOrder, historyID string) error {
	query := `UPDATE package_order 
			  SET history_status = $1
			  WHERE history_id = $2`
	_, err := db.Exec(query, updatedHistory.HistoryStatus, historyID)
	if err != nil {
		log.Println("Error updating history: ", err)
		return err
	}
	return nil
}

// func DeleteHistory(db *sql.DB, historyID string) (int64, error) {
// 	query := `DELETE FROM gen_history_order WHERE history_id = $1`
// 	query2 := `DELETE FROM gen_box_del WHERE history_id = $1`
// 	query3 := `DELETE FROM gen_history_order WHERE history_id = $1`
// 	result, err := db.Exec(query, historyID)
// 	if err != nil {
// 		log.Println("Error deleting history: ", err)
// 		return 0, err
// 	}

// 	rowsAffected, err := result.RowsAffected()
// 	if err != nil {
// 		log.Println("Error getting rows affected: ", err)
// 		return 0, err
// 	}

// 	return rowsAffected, nil
// }
