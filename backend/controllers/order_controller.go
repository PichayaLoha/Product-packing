package controllers

import (
	"database/sql"
	"fmt"
	"go-backend/models"
	"go-backend/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetOrders(c *gin.Context, db *sql.DB) {
	orders, err := services.GetOrders(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve orders"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"orders": orders})
}

func GetOrdersByID(c *gin.Context, db *sql.DB) {
	orderID := c.Param("order_id")
	fmt.Println("orderID: ", orderID)
	orders, err := services.GetOrdersByID(db, orderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve orders"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"orders": orders})
}

//	func GetOrderdels(c *gin.Context, db *sql.DB) {
//		orderdels, err := services.GetOrderdels(db)
//		if err != nil {
//			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve orders"})
//			return
//		}
//		c.JSON(http.StatusOK, gin.H{"orderdels": orderdels})
//	}
func CreateOrder(c *gin.Context, db *sql.DB) {
	var newOrder models.Order

	// อ่าน JSON จาก request
	if err := c.ShouldBindJSON(&newOrder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// กำหนดเวลาสั่งซื้อเป็นเวลาปัจจุบัน
	newOrder.OrderDate = time.Now()

	// เรียกใช้ service เพื่อสร้าง order
	if err := services.CreateOrder(db, &newOrder); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create order"})
		return
	}

	// ส่ง response กลับไป
	c.JSON(http.StatusCreated, gin.H{"message": "เพิ่มออเดอร์ใหม่สำเร็จ", "order": newOrder})
}
