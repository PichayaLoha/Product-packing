package models

import (
	"time"
)

type Product struct {
	ProductID     int       `gorm:"primaryKey;autoIncrement" json:"product_id"`
	ProductName   string    `gorm:"not null" json:"product_name"`
	ProductHeight float64   `gorm:"not null" json:"product_height"`
	ProductLength float64   `gorm:"not null" json:"product_length"`
	ProductWidth  float64   `gorm:"not null" json:"product_width"`
	ProductTime   time.Time `gorm:"not null" json:"product_time"`
	ProductAmount int       `gorm:"not null" json:"product_amount"`
	ProductWeight float64   `gorm:"not null" json:"product_weight"`
	ProductCost   float64   `gorm:"not null" json:"product_cost"`
	UserID        int       `gorm:"not null" json:"user_id"`
	ProductImage  string    `json:"product_image"`
	X             float64   `gorm:"-" json:"package_box_x"`
	Y             float64   `gorm:"-" json:"package_box_y"`
	Z             float64   `gorm:"-" json:"package_box_z"`
}
