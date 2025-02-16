package controllers

import (
	"database/sql"
	"go-backend/models"
	"go-backend/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// func GetProducts(c *gin.Context, db *sql.DB) {
// 	products, err := services.GetProducts(db)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve products"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"products": products})
// }

// func GetProductsByID(c *gin.Context, db *sql.DB) {
// 	productID := c.Param("product_id")
// 	fmt.Println("productID: ", productID)
// 	products, err := services.GetProductsByID(db, productID)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve products"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"products": products})
// }

func CreateOrder(c *gin.Context, db *sql.DB) {
	var newOrder models.Order

	if err := c.ShouldBindJSON(&newOrder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	newOrder.OrderDate = time.Now()

	if err := services.CreateOrder(db, &newOrder); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create order"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "เพิ่มออเดอร์ใหม่สำเร็จ", "order": newOrder})
}
