package models

import (
	"time"
)

type Order struct {
	OrderID      int       `json:"order_id"`
	CustomerID   int       `json:"customer_id"`
	OrderDate    time.Time `json:"order_date"`
	OrderDetails []OrderDetail
}

type OrderDetail struct {
	OrderDelID    int `json:"order_del_id"`
	ProductAmount int `json:"product_amount"`
	OrderID       int `json:"order_id"`
	ProductID     int `json:"product_id"`
}
