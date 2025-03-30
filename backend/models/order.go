package models

import "time"

// "time"

type OrderDetail struct {
	OrderDelID    int       `json:"order_del_id"`
	ProductAmount int       `json:"product_amount"`
	ProductID     int       `json:"product_id"`
	Product       Product   `json:"product"`
	OrderDelDate  time.Time `json:"order_del_date"`
}

type RequestBody struct {
	Mode         string `json:"mode"`
	BlockedBoxes []int  `json:"blocked_boxes"`
}
