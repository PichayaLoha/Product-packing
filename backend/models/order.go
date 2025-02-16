package models

import (
	"time"
)

type Order struct {
	OrderID    int       `json:"order_id"`
	CustomerID string    `json:"customer_id"`
	OrderDate  time.Time `json:"order_date"`
}

type OrderDetail struct {
	OrderDelID    int    `json:"order_del_id"`
	ProductAmount int    `json:"product_amount"`
	OrderID       string `json:"order_id"`
	ProductID     string `json:"product_id"`
}
