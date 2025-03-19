package services

import (
	"database/sql"
	"go-backend/models"
	"log"
)

func GetOrderdels(db *sql.DB) ([]models.OrderDetail, error) {
	rows, err := db.Query(`
		SELECT 
			od.order_del_id, od.product_amount, od.product_id, od.order_del_date,
			p.product_name, p.product_height, p.product_length, p.product_width,
			p.product_time, p.product_amount, p.product_weight, p.product_cost,
			p.user_id, p.product_image
		FROM order_dels od
		INNER JOIN products p ON od.product_id = p.product_id
	`)
	if err != nil {
		log.Println("Error querying orders: ", err)
		return nil, err
	}
	defer rows.Close()

	var orderdels []models.OrderDetail

	for rows.Next() {
		var orderdel models.OrderDetail
		var product models.Product

		// Scan ข้อมูลของ order_dels และ product
		if err := rows.Scan(
			&orderdel.OrderDelID, &orderdel.ProductAmount, &orderdel.ProductID, &orderdel.OrderDelDate,
			&product.ProductName, &product.ProductHeight, &product.ProductLength, &product.ProductWidth,
			&product.ProductTime, &product.ProductAmount, &product.ProductWeight, &product.ProductCost,
			&product.UserId, &product.ProductImage,
		); err != nil {
			log.Println("Error scanning order row: ", err)
			return nil, err
		}

		// ใส่ข้อมูล product เข้าไปใน OrderDetail
		orderdel.Product = product
		orderdels = append(orderdels, orderdel)
	}

	return orderdels, nil
}

func CreateOrderdels(db *sql.DB, newOrderdel *models.OrderDetail) error {

	query := `INSERT INTO order_dels (product_amount, product_id, order_del_date) 
               VALUES ($1, $2, $3) 
               RETURNING order_del_id`
	err := db.QueryRow(query, newOrderdel.ProductAmount, newOrderdel.ProductID, newOrderdel.OrderDelDate).Scan(&newOrderdel.OrderDelID)

	if err != nil {
		log.Println("Error inserting product: ", err)
		return err
	}
	return nil

}

func DeleteOrderDel(db *sql.DB, orderdelID string) (int64, error) {
	// ลบ order_del
	queryDelete := `DELETE FROM order_dels WHERE order_del_id = $1`
	result, err := db.Exec(queryDelete, orderdelID)
	if err != nil {
		log.Println("Error deleting orderdel: ", err)
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
