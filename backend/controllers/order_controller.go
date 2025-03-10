package controllers

import (
	"database/sql"
	"go-backend/models"
	"go-backend/services"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// func GetOrders(c *gin.Context, db *sql.DB) {
// 	orders, err := services.GetOrders(db)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve orders"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"orders": orders})
// }

//	func GetOrdersByID(c *gin.Context, db *sql.DB) {
//		orderID := c.Param("order_id")
//		fmt.Println("orderID: ", orderID)
//		orders, err := services.GetOrdersByID(db, orderID)
//		if err != nil {
//			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve orders"})
//			return
//		}
//		c.JSON(http.StatusOK, gin.H{"orders": orders})
//	}
func GetOrderdels(c *gin.Context, db *sql.DB) {
	orderdels, err := services.GetOrderdels(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve orders"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"orderdels": orderdels})
}
func CreateOrders(c *gin.Context, db *sql.DB) {
	var newOrderdel models.OrderDetail

	// อ่าน JSON จาก request
	if err := c.ShouldBindJSON(&newOrderdel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// กำหนดเวลาสั่งซื้อเป็นเวลาปัจจุบัน
	// newOrder.OrderDate = time.Now()
	newOrderdel.OrderDelDate = time.Now()
	// เรียกใช้ service เพื่อสร้าง order
	if err := services.CreateOrders(db, &newOrderdel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create order"})
		return
	}

	// ส่ง response กลับไป
	c.JSON(http.StatusCreated, gin.H{
		"message":        "เพิ่มออเดอร์ใหม่สำเร็จ",
		"order_id":       newOrderdel.OrderDelID,
		"product_id":     newOrderdel.ProductID,
		"product_amount": newOrderdel.ProductAmount,
		"order_del_date": newOrderdel.OrderDelDate})
}
func DeleteOrderDel(c *gin.Context, db *sql.DB) {
	orderdelID := c.Param("order_del_id")

	rowsAffected, err := services.DeleteOrderDel(db, orderdelID)
	if err != nil {
		log.Println("Error deleting orderdel: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to delete orderdel",
		})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "orderdel not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "orderdel deleted successfully",
	})
}
