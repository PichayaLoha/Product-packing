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

func GetOrderdels(c *gin.Context, db *sql.DB) {
	orderdels, err := services.GetOrderdels(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve orders"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"orderdels": orderdels})
}
func CreateOrderdels(c *gin.Context, db *sql.DB) {
	var newOrderdel models.OrderDetail

	// อ่าน JSON จาก request
	if err := c.ShouldBindJSON(&newOrderdel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	newOrderdel.OrderDelDate = time.Now()
	if err := services.CreateOrderdels(db, &newOrderdel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create order"})
		return
	}

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
