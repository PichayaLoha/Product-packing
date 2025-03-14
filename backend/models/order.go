package models

import "time"

// "time"

// type Order struct {
// 	OrderID      int           `json:"order_id"`
// 	CustomerID   int           `json:"customer_id"`
// 	OrderDate    time.Time     `json:"order_date"`
// 	OrderDetails []OrderDetail `json:"order_details"`
// }

type OrderDetail struct {
	OrderDelID    int `json:"order_del_id"`
	ProductAmount int `json:"product_amount"`
	// OrderID       int     `json:"order_id"`
	ProductID    int       `json:"product_id"`
	Product      Product   `json:"product"`
	OrderDelDate time.Time `json:"order_del_date"`
}
