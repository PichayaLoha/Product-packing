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
