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
}
type HistoryDel struct {
	HistoryDelID      int         `json:"package_del_id"`
	HistoryDelBoxSize string      `json:"package_del_boxsize"`
	GenBoxDels        []GenBoxDel `json:"package_id"`
}

type GenBoxDel struct {
	GenBoxDelID     int     `json:"package_box_id"`
	GenBoxDelName   string  `json:"product_name"`
	GenBoxDelHeight float64 `json:"product_height"`
	GenBoxDelLength float64 `json:"product_length"`
	GenBoxDelWidth  float64 `json:"product_width"`
	GenBoxDelWeight float64 `json:"product_weight"`
	GenBoxDelX      float64 `json:"package_box_x"`
	GenBoxDelY      float64 `json:"package_box_y"`
	GenBoxDelZ      float64 `json:"package_box_z"`
}

type History struct {
	HistoryID     int               `json:"package_id"`
	HistoryAmount int               `json:"package_amount"`
	HistoryTime   time.Time         `json:"package_time"`
	HistoryStatus HistoryStatusEnum `json:"package_status"`
	HistoryDels   []HistoryDel      `json:"history_dels"`
}
