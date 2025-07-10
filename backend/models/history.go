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
	HistoryID          int       `gorm:"primaryKey;autoIncrement" json:"package_id"`
	HistoryAmount      int       `gorm:"column:package_amount" json:"package_amount"`
	HistoryTime        time.Time `json:"package_time"`
	HistoryStatus      string    `gorm:"type:history_status_enum" json:"package_status"`
	HistoryProductCost float64   `json:"package_product_cost"`
	HistoryBoxCost     float64   `json:"package_box_cost"`
	HistoryTotalCost   float64   `json:"package_total_cost"`
	CustomerID         int       `json:"customer_id"`
	HistoryUserID      int       `json:"package_user_id"`
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
