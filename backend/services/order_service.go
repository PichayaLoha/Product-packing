package services

import (
	"database/sql"
	"go-backend/models"
	"log"
)

// func GetOrders(db *sql.DB) ([]models.Order, error) {
// 	rows, err := db.Query(`SELECT order_id, customer_id, order_date FROM orders`)
// 	if err != nil {
// 		log.Println("Error querying orders: ", err)
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var orders []models.Order

// 	for rows.Next() {
// 		var order models.Order
// 		if err := rows.Scan(&order.OrderID, &order.CustomerID, &order.OrderDate); err != nil {
// 			log.Println("Error scanning order row: ", err)
// 			return nil, err
// 		}
// 		orders = append(orders, order)
// 	}

// 	return orders, nil
// }

// func GetOrdersByID(db *sql.DB, ordersID string) ([]models.Order, error) {
// 	query := `SELECT order_id, customer_id, order_date FROM orders WHERE order_id = $1;`
// 	rows, err := db.Query(query, ordersID)
// 	if err != nil {
// 		log.Println("Error querying orders: ", err)
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var orders []models.Order
// 	fmt.Println("order1: ", orders)
// 	for rows.Next() {
// 		var order models.Order
// 		if err := rows.Scan(&order.OrderID, &order.CustomerID, &order.OrderDate); err != nil {
// 			log.Println("Error scanning order row: ", err)
// 			return nil, err
// 		}
// 		orders = append(orders, order)
// 	}
// 	fmt.Println("order2: ", orders)

//		return orders, nil
//	}
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
	// ค้นหา order_id ก่อนลบ
	var orderID int
	queryGetOrder := `SELECT order_id FROM order_dels WHERE order_del_id = $1`
	err := db.QueryRow(queryGetOrder, orderdelID).Scan(&orderID)
	if err != nil {
		log.Println("Error fetching order_id: ", err)
		return 0, err
	}

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

	// ตรวจสอบว่ามี order_id นี้เหลืออยู่ใน order_dels หรือไม่
	var count int
	queryCheck := `SELECT COUNT(*) FROM order_dels WHERE order_id = $1`
	err = db.QueryRow(queryCheck, orderID).Scan(&count)
	if err != nil {
		log.Println("Error checking order_dels count: ", err)
		return rowsAffected, err
	}

	// ถ้าไม่มี order_del ที่ใช้ order_id นี้แล้ว ให้ลบ order ใน orders
	if count == 0 {
		queryDeleteOrder := `DELETE FROM orders WHERE order_id = $1`
		_, err := db.Exec(queryDeleteOrder, orderID)
		if err != nil {
			log.Println("Error deleting order: ", err)
			return rowsAffected, err
		}
		log.Println("Deleted order_id:", orderID)
	}

	return rowsAffected, nil
}
