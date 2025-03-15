package services

import (
	"database/sql"
	"go-backend/models"
	"log"
)

func GetBoxes(db *sql.DB) ([]models.Box, error) {
	rows, err := db.Query(`SELECT box_id, box_name, box_height, box_length, box_width, box_amount, box_maxweight FROM boxes`)
	if err != nil {
		log.Println("Error querying boxes: ", err)
		return nil, err
	}
	defer rows.Close()

	var boxes []models.Box

	for rows.Next() {
		var box models.Box
		if err := rows.Scan(&box.BoxID, &box.BoxName, &box.BoxHeight, &box.BoxLength, &box.BoxWidth, &box.BoxAmount, &box.BoxMaxWeight); err != nil {
			log.Println("Error scanning box row: ", err)
			return nil, err
		}
		boxes = append(boxes, box)
	}

	return boxes, nil
}

func GetBoxesByID(db *sql.DB, boxID string) ([]models.Box, error) {
	query := `SELECT box_id, box_name, box_height, box_length, box_width, box_amount, box_maxweight, box_cost FROM boxes WHERE box_id = $1;`
	rows, err := db.Query(query, boxID)
	if err != nil {
		log.Println("Error querying boxs: ", err)
		return nil, err
	}
	defer rows.Close()

	var boxes []models.Box

	for rows.Next() {
		var box models.Box
		if err := rows.Scan(&box.BoxID, &box.BoxName, &box.BoxHeight, &box.BoxLength, &box.BoxWidth, &box.BoxAmount, &box.BoxMaxWeight, &box.BoxCost); err != nil {
			log.Println("Error scanning box row: ", err)
			return nil, err
		}
		boxes = append(boxes, box)
	}

	return boxes, nil
}

func CreateBoxes(db *sql.DB, newBox *models.Box) error {

	query := `INSERT INTO boxes (box_name, box_height, box_length, box_width, box_amount, box_maxweight) 
               VALUES ($1, $2, $3, $4, $5, $6) 
               RETURNING box_id`
	err := db.QueryRow(query, newBox.BoxName, newBox.BoxHeight, newBox.BoxLength, newBox.BoxWidth, newBox.BoxAmount, newBox.BoxMaxWeight).Scan(&newBox.BoxID)

	if err != nil {
		log.Println("Error inserting box: ", err)
		return err
	}
	return nil

}

func UpdateBoxes(db *sql.DB, updatedBoxes *models.Box, boxID string) error {

	query := `UPDATE boxes 
              SET box_name = $1, box_height = $2, box_length = $3, box_width = $4, box_amount = $5, box_maxweight = $6
			  WHERE box_id = $7`

	_, err := db.Exec(query, updatedBoxes.BoxName, updatedBoxes.BoxHeight, updatedBoxes.BoxLength, updatedBoxes.BoxWidth, updatedBoxes.BoxAmount, updatedBoxes.BoxMaxWeight, boxID)
	if err != nil {
		log.Println("Error updating box: ", err)
		return err
	}
	return nil
}

func DeleteBoxes(db *sql.DB, boxID string) (int64, error) {
	query := `DELETE FROM boxes WHERE box_id = $1`
	result, err := db.Exec(query, boxID)
	if err != nil {
		log.Println("Error deleting box: ", err)
		return 0, err
	}

	// ตรวจสอบจำนวนแถวที่ถูกลบ
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("Error getting rows affected: ", err)
		return 0, err
	}

	return rowsAffected, nil
}
