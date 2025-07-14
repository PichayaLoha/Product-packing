package models

import "time"

type Order struct {
	PackageID          int       `gorm:"primaryKey;autoIncrement" json:"history_id"`
	PackageAmount      int       `gorm:"column:history_amount;not null" json:"history_amount"`
	PackageStatus      string    `gorm:"column:history_status;type:history_status_enum;not null" json:"history_status"`
	PackageTime        time.Time `gorm:"column:history_time;not null" json:"history_time"`
	PackageUserID      int       `gorm:"column:history_user_id;not null" json:"history_user_id"`
	CustomerID         int       `gorm:"not null" json:"customer_id"`
	PackageProductCost float64   `gorm:"column:history_product_cost;not null" json:"history_product_cost"`
	PackageBoxCost     float64   `gorm:"column:history_box_cost;not null" json:"history_box_cost"`
	PackageTotalCost   float64   `gorm:"column:history_total_cost;not null" json:"history_total_cost"`
}

func (o *Order) TableName() string {
	return "packages_order"
}

type OrderDetail struct {
	OrderDelID   int       `gorm:"primaryKey;autoIncrement" json:"order_del_id"`
	ProductAmount int       `gorm:"not null" json:"product_amount"`
	ProductID    int       `gorm:"not null" json:"product_id"`
	OrderDelDate time.Time `gorm:"not null" json:"order_del_date"`
}

func (od *OrderDetail) TableName() string {
	return "order_dels"
}

type RequestBody struct {
	Mode       string    `json:"mode"`
	BlockedBoxes []string  `json:"blocked_boxes"`
	UserId     int       `json:"user_id"`
}
