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
		log.Println("Error querying products: ", err)
		return nil, err
	}
	defer rows.Close()

	var orders []models.Order

	for rows.Next() {
		var order models.Order
		if err := rows.Scan(&order.OrderID, &order.CustomerID, &order.OrderDate); err != nil {
			log.Println("Error scanning product row: ", err)
			return nil, err
		}
		orders = append(orders, order)
	}

	return orders, nil
}

func CreateOrders(db *sql.DB, newOrder *models.Order) error {
	fmt.Println("neworder", newOrder)
	query := `INSERT INTO orders (customer_id, order_date) 
              VALUES ($1, $2) 
              RETURNING order_id`
	err := db.QueryRow(query, newOrder.CustomerID, newOrder.OrderDate).Scan(&newOrder.OrderID)
	if err != nil {
		log.Println("Error inserting orders:", err)
		return err
	}
	log.Println("Inserted orders:", newOrder.OrderID)

	for _, orderDel := range newOrder.OrderDel {
		var orderDelID int
		query1 := `INSERT INTO order_dels (product_amount, order_id, product_id) 
				   VALUES ($1, $2, $3) 
				   RETURNING order_del_id`
		err1 := db.QueryRow(query1, orderDel.ProductAmout, newOrder.OrderID, orderDel.ProductID).Scan(&orderDelID)
		if err1 != nil {
			log.Println("Error inserting order_dels:", err1)
			return err1
		}
		log.Println("Inserted order_dels:", orderDelID)
	}

	return nil
}
