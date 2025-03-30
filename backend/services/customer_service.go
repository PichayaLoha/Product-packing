package services

import (
	"database/sql"
	"go-backend/models"
	"log"
)

func GetCustomers(db *sql.DB) ([]models.Customer, error) {
	rows, err := db.Query(`SELECT customer_id, customer_firstname, customer_lastname, customer_address, customer_phone, customer_postal FROM customers`)
	if err != nil {
		log.Println("Error querying customers: ", err)
		return nil, err
	}
	defer rows.Close()

	var customers []models.Customer

	for rows.Next() {
		var customer models.Customer
		if err := rows.Scan(&customer.CustomerID, &customer.CustomerFirstName, &customer.CustomerLastName, &customer.CustomerAddress, &customer.CustomerPhone, &customer.CustomerPostal); err != nil {
			log.Println("Error scanning customer row: ", err)
			return nil, err
		}
		customers = append(customers, customer)
	}

	return customers, nil
}

func GetCustomersByID(db *sql.DB, customerID string) ([]models.Customer, error) {
	query := `SELECT customer_id, customer_firstname, customer_lastname, customer_address, customer_postal, customer_phone FROM customers WHERE customer_id = $1;`
	rows, err := db.Query(query, customerID)
	if err != nil {
		log.Println("Error querying customers: ", err)
		return nil, err
	}
	defer rows.Close()

	var customers []models.Customer

	for rows.Next() {
		var customer models.Customer
		if err := rows.Scan(&customer.CustomerID, &customer.CustomerFirstName, &customer.CustomerLastName, &customer.CustomerAddress, &customer.CustomerPostal, &customer.CustomerPhone); err != nil {
			log.Println("Error scanning customer row: ", err)
			return nil, err
		}
		customers = append(customers, customer)
	}

	return customers, nil
}

func CreateCustomers(db *sql.DB, newCustomer *models.Customer) (int, error) {
	var customerID int
	query := `INSERT INTO customers (customer_firstname, customer_lastname, customer_address, customer_phone, customer_postal) 
               VALUES ($1, $2, $3, $4, $5) 
               RETURNING customer_id`
	err := db.QueryRow(query, newCustomer.CustomerFirstName, newCustomer.CustomerLastName, newCustomer.CustomerAddress, newCustomer.CustomerPhone, newCustomer.CustomerPostal).Scan(&customerID)

	if err != nil {
		log.Println("Error inserting customer: ", err)
		return 0, err
	}
	return customerID, nil
}
func UpdateCustomers(db *sql.DB, updatedCustomers *models.Customer, customerID string) error {

	query := `UPDATE customers
			  SET customer_firstname = $1, customer_lastname = $2, customer_address = $3, customer_phone = $4, customer_postal = $5 
			  WHERE customer_id = $6`

	_, err := db.Exec(query, updatedCustomers.CustomerFirstName, updatedCustomers.CustomerLastName, updatedCustomers.CustomerAddress, updatedCustomers.CustomerPhone, updatedCustomers.CustomerPostal, customerID)
	if err != nil {
		log.Println("Error updating customer: ", err)
		return err
	}
	return nil
}

func DeleteCustomer(db *sql.DB, customerID string) (int64, error) {
	query := `DELETE FROM customers WHERE customer_id = $1`
	result, err := db.Exec(query, customerID)
	if err != nil {
		log.Println("Error deleting customer: ", err)
		return 0, err
	}

	// ตรวจสอบจำนวนแถวที่ถูกลบ
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("Error getting rows affected: ", err)
		return 0, err
	}

	return rowsAffected, nil
}
