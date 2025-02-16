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
	// if newProduct.ProductCost <= 0 {
	// 	return fmt.Errorf("product_cost ต้องมากกว่า 0")
	// }
	query := `INSERT INTO orders (customer_id, order_date) 
              VALUES ($1, $2) 
              RETURNING order_id`
	err := db.QueryRow(query, newOrder.CustomerID, newOrder.OrderDate).Scan(&newOrder.OrderID)

	if err != nil {
		log.Println("Error inserting product: ", err)
		return err
	}
	return nil
}
