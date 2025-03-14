package models

// "time"

// type Order struct {
// 	OrderID      int           `json:"order_id"`
// 	CustomerID   int           `json:"customer_id"`
// 	OrderDate    time.Time     `json:"order_date"`
// 	OrderDetails []OrderDetail `json:"order_details"`
// }

type Customer struct {
	CustomerID        int    `json:"customer_id"`
	CustomerFirstName string `json:"customer_firstname"`
	CustomerLastName  string `json:"customer_lastname"`
	CustomerAddress   string `json:"customer_address"`
	CustomerPostal    string `json:"customer_postal"`
	CustomerPhone     string `json:"customer_phone"`
}
