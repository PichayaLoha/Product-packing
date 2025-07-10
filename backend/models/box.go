package models

type Box struct {
	BoxID        int     `gorm:"primaryKey;autoIncrement" json:"box_id"`
	BoxName      string  `gorm:"type:varchar(10);unique;not null" json:"box_name"`
	BoxHeight    float64 `gorm:"not null" json:"box_height"`
	BoxLength    float64 `gorm:"not null" json:"box_length"`
	BoxWidth     float64 `gorm:"not null" json:"box_width"`
	BoxAmount    int     `gorm:"not null" json:"box_amount"`
	BoxMaxWeight float64 `json:"box_max_weight"`
	BoxCost      float64 `gorm:"not null" json:"box_cost"`
	BoxMaterial  string  `json:"box_material"`
}

type PackedBox struct {
	Size     Box
	Products []Product
}
