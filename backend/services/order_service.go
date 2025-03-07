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
func GetOrderdels(db *sql.DB) ([]models.OrderDetail, error) {
	rows, err := db.Query(`
		SELECT 
			od.order_del_id, od.product_amount, od.order_id, od.product_id,
			p.product_name, p.product_height, p.product_length, p.product_width,
			p.product_time, p.product_amount, p.product_weight, p.product_cost,
			p.user_id
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
			&orderdel.OrderDelID, &orderdel.ProductAmount, &orderdel.OrderID, &orderdel.ProductID,
			&product.ProductName, &product.ProductHeight, &product.ProductLength, &product.ProductWidth,
			&product.ProductTime, &product.ProductAmount, &product.ProductWeight, &product.ProductCost,
			&product.UserId,
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

// func GetOrderdels(db *sql.DB) ([]models.OrderDetail, error) {
// 	rows, err := db.Query(`SELECT order_del_id, order_id, product_amount, product_id FROM order_dels`)
// 	if err != nil {
// 		log.Println("Error querying orders: ", err)
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	query := `SELECT product_id, product_name, product_height, product_length, product_width, product_time,
// 	product_amount, product_weight, product_cost, user_id FROM products WHERE product_id = $1;`
// 	rows1, err1 := db.Query(query, productID)
// 	if err1 != nil {
// 		log.Println("Error querying products: ", err)
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var products []models.Product

// 	var orderdels []models.OrderDetail

// 	for rows.Next() {
// 		var orderdel models.OrderDetail
// 		if err := rows.Scan(&orderdel.OrderDelID, &orderdel.OrderID, &orderdel.ProductAmount, &orderdel.ProductID); err != nil {
// 			log.Println("Error scanning order details row: ", err)
// 			return nil, err
// 		}
// 		orderdels = append(orderdels, orderdel)
// 	}
// 	for rows1.Next() {
// 		var product models.Product
// 		if err := rows.Scan(&product.ProductID, &product.ProductName, &product.ProductHeight, &product.ProductLength, &product.ProductWidth,
// 			&product.ProductTime, &product.ProductAmount, &product.ProductWeight, &product.ProductCost, &product.UserId); err != nil {
// 			log.Println("Error scanning product row: ", err)
// 			return nil, err
// 		}
// 		products = append(products, product)
// 	}
// 	return orderdels, nil
// }

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
