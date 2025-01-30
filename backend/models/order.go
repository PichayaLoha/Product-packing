package models

import (
	"time"
)

type Order struct {
	OrderID    int       `json:"order_id"`
	CustomerID int       `json:"customer_id"`
	OrderDate  time.Time `json:"order_date"`
	OrderDel   []OrderDetails
}

type OrderDetails struct {
	OrderDelID   int `json:"order_del_id"`
	ProductAmout int `json:"product_amount"`
	OrderID      int `json:"order_id"`
	ProductID    int `json:"product_id"`
	ProductDel   []Product
}
