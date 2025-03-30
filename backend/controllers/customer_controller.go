package controllers

import (
	"database/sql"
	"fmt"
	"go-backend/models"
	"go-backend/services"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetCustomers(c *gin.Context, db *sql.DB) {
	customers, err := services.GetCustomers(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve customers"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"customer": customers})
}

func GetCustomersByID(c *gin.Context, db *sql.DB) {
	customerID := c.Param("customer_id")
	fmt.Println("customerID: ", customerID)
	customers, err := services.GetCustomersByID(db, customerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve customers"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"customers": customers})
}

func CreateCustomers(c *gin.Context, db *sql.DB) {
	var newCustomer models.Customer

	if err := c.ShouldBindJSON(&newCustomer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if _, err := services.CreateCustomers(db, &newCustomer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create customer"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "เพิ่มลูกค้าใหม่สำเร็จ",
		"customer": newCustomer,
	})
}

func UpdateCustomers(c *gin.Context, db *sql.DB) {
	var updatedCustomer models.Customer

	customerID := c.Param("customer_id")

	if err := c.ShouldBindJSON(&updatedCustomer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	if err := services.UpdateCustomers(db, &updatedCustomer, customerID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to update customer",
		})
		return
	}
	updatedCustomer.CustomerID, _ = strconv.Atoi(customerID)
	c.JSON(http.StatusOK, gin.H{
		"message":  "อัปเดตลูกค้าสำเร็จ",
		"customer": updatedCustomer,
	})
}

func DeleteCustomer(c *gin.Context, db *sql.DB) {
	customerID := c.Param("customer_id")

	rowsAffected, err := services.DeleteCustomer(db, customerID)
	if err != nil {
		log.Println("Error deleting customer: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to delete customer",
		})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Customer not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Customer deleted successfully",
	})
}
