package services

import (
	"database/sql"
	"fmt"
	"go-backend/models"
	"log"
)

func GetProducts(db *sql.DB) ([]models.Product, error) {
	rows, err := db.Query(`SELECT product_id, product_name, product_height, product_length, product_width, 
	product_time, product_amount, product_weight, product_cost, user_id FROM products`)
	if err != nil {
		log.Println("Error querying products: ", err)
		return nil, err
	}
	defer rows.Close()

	var products []models.Product

	for rows.Next() {
		var product models.Product
		if err := rows.Scan(&product.ProductID, &product.ProductName, &product.ProductHeight, &product.ProductLength, &product.ProductWidth,
			&product.ProductTime, &product.ProductAmount, &product.ProductWeight, &product.ProductCost, &product.UserId); err != nil {
			log.Println("Error scanning product row: ", err)
			return nil, err
		}
		products = append(products, product)
	}

	return products, nil
}

func GetProductsByID(db *sql.DB, productID string) ([]models.Product, error) {
	query := `SELECT product_id, product_name, product_height, product_length, product_width, product_time, 
	product_amount, product_weight, product_cost, user_id FROM products WHERE product_id = $1;`
	rows, err := db.Query(query, productID)
	if err != nil {
		log.Println("Error querying products: ", err)
		return nil, err
	}
	defer rows.Close()

	var products []models.Product

	for rows.Next() {
		var product models.Product
		if err := rows.Scan(&product.ProductID, &product.ProductName, &product.ProductHeight, &product.ProductLength, &product.ProductWidth,
			&product.ProductTime, &product.ProductAmount, &product.ProductWeight, &product.ProductCost, &product.UserId); err != nil {
			log.Println("Error scanning product row: ", err)
			return nil, err
		}
		products = append(products, product)
	}

	return products, nil
}

func CreateProduct(db *sql.DB, newProduct *models.Product) error {
	if newProduct.ProductCost <= 0 {
		return fmt.Errorf("product_cost ต้องมากกว่า 0")
	}
	query := `INSERT INTO products (product_name, product_height, product_length, product_width, product_time, product_amount, product_weight, product_cost, user_id) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
              RETURNING product_id`
	err := db.QueryRow(query, newProduct.ProductName, newProduct.ProductHeight, newProduct.ProductLength, newProduct.ProductWidth, newProduct.ProductTime, newProduct.ProductAmount, newProduct.ProductWeight,
		newProduct.ProductCost, newProduct.UserId).Scan(&newProduct.ProductID)

	if err != nil {
		log.Println("Error inserting product: ", err)
		return err
	}
	return nil
}

func UpdateProduct(db *sql.DB, updatedProduct *models.Product, productID string) error {
	fmt.Println("service: ", productID)
	query := `UPDATE products 
              SET product_name = $1, product_height = $2, product_length = $3, product_width = $4, product_time = $5, product_amount = $6, product_weight = $7, product_cost = $8, user_id = $9
              WHERE product_id = $10`
	_, err := db.Exec(query, updatedProduct.ProductName, updatedProduct.ProductHeight, updatedProduct.ProductLength, updatedProduct.ProductWidth,
		updatedProduct.ProductTime, updatedProduct.ProductAmount, updatedProduct.ProductWeight, updatedProduct.ProductCost, updatedProduct.UserId, productID)
	if err != nil {
		log.Println("Error updating product: ", err)
		return err
	}
	return nil
}

func DeleteProduct(db *sql.DB, productID string) (int64, error) {
	query := `DELETE FROM products WHERE product_id = $1`
	result, err := db.Exec(query, productID)
	if err != nil {
		log.Println("Error deleting product: ", err)
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
