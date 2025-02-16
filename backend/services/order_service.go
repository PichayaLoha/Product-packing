package services

import (
	"database/sql"
	"go-backend/models"
	"log"
)

// func GetProducts(db *sql.DB) ([]models.Product, error) {
// 	rows, err := db.Query(`SELECT product_id, product_name, product_height, product_length, product_width,
// 	product_time, product_amount, product_weight, product_cost, user_id FROM products`)
// 	if err != nil {
// 		log.Println("Error querying products: ", err)
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var products []models.Product

// 	for rows.Next() {
// 		var product models.Product
// 		if err := rows.Scan(&product.ProductID, &product.ProductName, &product.ProductHeight, &product.ProductLength, &product.ProductWidth,
// 			&product.ProductTime, &product.ProductAmount, &product.ProductWeight, &product.ProductCost, &product.UserId); err != nil {
// 			log.Println("Error scanning product row: ", err)
// 			return nil, err
// 		}
// 		products = append(products, product)
// 	}

// 	return products, nil
// }

// func GetProductsByID(db *sql.DB, productID string) ([]models.Product, error) {
// 	query := `SELECT product_id, product_name, product_height, product_length, product_width, product_time,
// 	product_amount, product_weight, product_cost, user_id FROM products WHERE product_id = $1;`
// 	rows, err := db.Query(query, productID)
// 	if err != nil {
// 		log.Println("Error querying products: ", err)
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var products []models.Product

// 	for rows.Next() {
// 		var product models.Product
// 		if err := rows.Scan(&product.ProductID, &product.ProductName, &product.ProductHeight, &product.ProductLength, &product.ProductWidth,
// 			&product.ProductTime, &product.ProductAmount, &product.ProductWeight, &product.ProductCost, &product.UserId); err != nil {
// 			log.Println("Error scanning product row: ", err)
// 			return nil, err
// 		}
// 		products = append(products, product)
// 	}

// 	return products, nil
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
