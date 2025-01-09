package models

type Box struct {
	BoxID        int     `json:"box_id"`
	BoxName      string  `json:"box_name"`
	BoxHeight    float64 `json:"box_height"`
	BoxLength    float64 `json:"box_length"`
	BoxWidth     float64 `json:"box_width"`
	BoxAmount    int     `json:"box_amount"`
	BoxMaxWeight float64 `json:"box_maxweight"`
	BoxCost      float64 `json:"box_cost"`
	BoxMaterial  string  `json:"box_material"`
}

type PackedBox struct {
	Size     Box
	Products []Product
}
