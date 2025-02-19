package services

import (
	"database/sql"
	"fmt"
	"go-backend/models"
	"log"
)

func GetOrders(db *sql.DB) ([]models.Order, error) {
	rows, err := db.Query(`SELECT order_id, customer_id, order_date FROM orders`)
	if err != nil {
		log.Println("Error querying orders: ", err)
		return nil, err
	}
	defer rows.Close()

	var orders []models.Order

	for rows.Next() {
		var order models.Order
		if err := rows.Scan(&order.OrderID, &order.CustomerID, &order.OrderDate); err != nil {
			log.Println("Error scanning order row: ", err)
			return nil, err
		}
		orders = append(orders, order)
	}

	return orders, nil
}

func GetOrdersByID(db *sql.DB, ordersID string) ([]models.Order, error) {
	query := `SELECT order_id, customer_id, order_date FROM orders WHERE order_id = $1;`
	rows, err := db.Query(query, ordersID)
	if err != nil {
		log.Println("Error querying orders: ", err)
		return nil, err
	}
	defer rows.Close()

	var orders []models.Order
	fmt.Println("order1: ", orders)
	for rows.Next() {
		var order models.Order
		if err := rows.Scan(&order.OrderID, &order.CustomerID, &order.OrderDate); err != nil {
			log.Println("Error scanning order row: ", err)
			return nil, err
		}
		orders = append(orders, order)
	}
	fmt.Println("order2: ", orders)

	return orders, nil
}

func CreateOrder(db *sql.DB, newOrder *models.Order) error {
	// 1️⃣ สร้าง Order และรับ order_id
	var orderId int
	query := `INSERT INTO orders (customer_id, order_date) 
              VALUES ($1, $2) 
              RETURNING order_id`
	err := db.QueryRow(query, newOrder.CustomerID, newOrder.OrderDate).Scan(&orderId)

	if err != nil {
		log.Println("Error inserting order: ", err)
		return err
	}
	// 2️⃣ วนลูป insert ข้อมูลลงใน order_dels
	query1 := `INSERT INTO order_dels (product_amount, order_id, product_id) 
               VALUES ($1, $2, $3) 
               RETURNING order_del_id`
	fmt.Println(newOrder.OrderDetails)
	for i := range newOrder.OrderDetails {
		var orderDelId int
		orderDetail := &newOrder.OrderDetails[i] // ใช้ pointer เพื่ออัปเดตค่าใน slice
		err1 := db.QueryRow(query1, orderDetail.ProductAmount, orderId, orderDetail.ProductID).Scan(&orderDelId)

		if err1 != nil {
			log.Println("Error inserting order details: ", err1)
			return err1
		}
		// อัปเดตค่า order_del_id ที่เพิ่ง insert กลับไปที่ slice
		orderDetail.OrderDelID = orderDelId
	}

	return nil
}
