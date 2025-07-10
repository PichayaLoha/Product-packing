package models

import (
	"time"
)

type HistoryStatusEnum string

const (
	Packed   HistoryStatusEnum = "Packed"
	Unpacked HistoryStatusEnum = "Unpacked"
)

type History struct {
	HistoryID          int       `gorm:"primaryKey;autoIncrement" json:"history_id"`
	HistoryAmount      int       `gorm:"column:history_amount" json:"history_amount"`
	HistoryTime        time.Time `gorm:"column:history_time" json:"history_time"`
	HistoryStatus      string    `gorm:"column:history_status;type:history_status_enum" json:"history_status"`
	HistoryProductCost float64   `gorm:"column:history_product_cost" json:"history_product_cost"`
	HistoryBoxCost     float64   `gorm:"column:history_box_cost" json:"history_box_cost"`
	HistoryTotalCost   float64   `gorm:"column:history_total_cost" json:"history_total_cost"`
	CustomerID         int       `json:"customer_id"`
	HistoryUserID      int       `gorm:"column:history_user_id" json:"history_user_id"`
}

func (h *History) TableName() string {
	return "packages_order"
}

type PackageDel struct {
	PackageDelID      int    `gorm:"primaryKey;autoIncrement" json:"package_del_id"`
	PackageDelBoxSize string `json:"package_del_boxsize"`
	PackageID         int    `json:"package_id"`
}

func (pd *PackageDel) TableName() string {
	return "package_dels"
}

type PackageBoxDel struct {
	PackageBoxID int     `gorm:"primaryKey;autoIncrement" json:"package_box_id"`
	PackageBoxX  float64 `json:"package_box_x"`
	PackageBoxY  float64 `json:"package_box_y"`
	PackageBoxZ  float64 `json:"package_box_z"`
	PackageDelID int     `json:"package_del_id"`
	ProductID    int     `json:"product_id"`
}

func (pbd *PackageBoxDel) TableName() string {
	return "package_box_dels"
}
