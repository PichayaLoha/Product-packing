package models

import "time"

type Order struct {
	PackageID          int       `gorm:"primaryKey;autoIncrement" json:"package_id"`
	PackageAmount      int       `gorm:"column:package_amount;not null" json:"package_amount"`
	PackageStatus      string    `gorm:"type:history_status_enum;not null" json:"package_status"`
	PackageTime        time.Time `gorm:"not null" json:"package_time"`
	PackageUserID      int       `gorm:"not null" json:"package_user_id"`
	CustomerID         int       `gorm:"not null" json:"customer_id"`
	PackageProductCost float64   `gorm:"not null" json:"package_product_cost"`
	PackageBoxCost     float64   `gorm:"not null" json:"package_box_cost"`
	PackageTotalCost   float64   `gorm:"not null" json:"package_total_cost"`
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
	Mode         string `json:"mode"`
	BlockedBoxes []int  `json:"blocked_boxes"`
	UserId       int    `json:"user_id"`
}
