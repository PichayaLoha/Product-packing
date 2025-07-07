package models

type Customer struct {
	CustomerID        int    `gorm:"primaryKey;autoIncrement" json:"customer_id"`
	CustomerFirstName string `json:"customer_firstname"`
	CustomerLastName  string `json:"customer_lastname"`
	CustomerAddress   string `json:"customer_address"`
	CustomerPostal    string `json:"customer_postal"`
	CustomerPhone     string `json:"customer_phone"`
}
