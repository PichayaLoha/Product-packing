package models

import (
	"time"
)

type HistoryStatusEnum string

const (
	Packed   HistoryStatusEnum = "Packed"
	Unpacked HistoryStatusEnum = "Unpacked"
)

type HistoryOrder struct {
	BoxName            string
	Products           []Product
	HistoryStatus      HistoryStatusEnum `json:"package_status"`
	HistoryProductCost float64           `json:"package_product_cost"`
	HistoryBoxCost     float64           `json:"package_box_cost"`
	HistoryTotalCost   float64           `json:"package_total_cost"`
	CustomerID         int               `json:"customer_id"`
}
type HistoryDel struct {
	HistoryDelID      int         `json:"package_del_id"`
	HistoryDelBoxSize string      `json:"package_del_boxsize"`
	GenBoxDels        []GenBoxDel `json:"package_id"`
}

type GenBoxDel struct {
	GenBoxDelID     int      `json:"package_box_id"`
	GenBoxDelName   string   `json:"product_name"`
	GenBoxDelHeight float64  `json:"product_height"`
	GenBoxDelLength float64  `json:"product_length"`
	GenBoxDelWidth  float64  `json:"product_width"`
	GenBoxDelWeight float64  `json:"product_weight"`
	GenBoxDelX      float64  `json:"package_box_x"`
	GenBoxDelY      float64  `json:"package_box_y"`
	GenBoxDelZ      float64  `json:"package_box_z"`
	GenBlockedBoxes []string `json:"blockedBoxes"`
}

type History struct {
	HistoryID          int               `json:"package_id"`
	HistoryAmount      int               `json:"package_amount"`
	HistoryTime        time.Time         `json:"package_time"`
	HistoryStatus      HistoryStatusEnum `json:"package_status"`
	HistoryDels        []HistoryDel      `json:"history_dels"`
	HistoryProductCost float64           `json:"package_product_cost"`
	HistoryBoxCost     float64           `json:"package_box_cost"`
	HistoryTotalCost   float64           `json:"package_total_cost"`
	CustomerID         int               `json:"customer_id"`
	CustomerFirstName  string            `json:"customer_firstname"`
	CustomerLastName   string            `json:"customer_lastname"`
	CustomerAddress    string            `json:"customer_address"`
	CustomerPostal     string            `json:"customer_postal"`
	CustomerPhone      string            `json:"customer_phone"`
}

type PackageDetail struct {
	PackageBoxID  int     `json:"package_box_id"`
	PackageBoxX   float64 `json:"package_box_x"`
	PackageBoxY   float64 `json:"package_box_y"`
	PackageBoxZ   float64 `json:"package_box_z"`
	PackageDelID  int     `json:"package_del_id"`
	BoxID         int     `json:"box_id"`
	BoxName       string  `json:"box_name"`
	BoxWidth      float64 `json:"box_width"`
	BoxLength     float64 `json:"box_length"`
	BoxHeight     float64 `json:"box_height"`
	ProductID     int     `json:"product_id"`
	ProductName   string  `json:"product_name"`
	ProductWidth  float64 `json:"product_width"`
	ProductLength float64 `json:"product_length"`
	ProductHeight float64 `json:"product_height"`
}
