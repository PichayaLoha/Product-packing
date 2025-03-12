package models

import (
	"time"
)

type Product struct {
	ProductID     int       `json:"product_id"`
	ProductName   string    `json:"product_name"`
	ProductHeight float64   `json:"product_height"`
	ProductLength float64   `json:"product_length"`
	ProductWidth  float64   `json:"product_width"`
	ProductTime   time.Time `json:"product_time"`
	ProductAmount int       `json:"product_amount"`
	ProductWeight float64   `json:"product_weight"`
	ProductCost   float64   `json:"product_cost"`
	UserId        int       `json:"user_id"`
	ProductImage  string    `json:"product_image"`
	X             float64   `json:"package_box_x"`
	Y             float64   `json:"package_box_y"`
	Z             float64   `json:"package_box_z"`
}
