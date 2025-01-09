package controllers

import (
	"database/sql"
	"go-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ฟังก์ชันดึงข้อมูลกล่องทั้งหมด
func GetBoxes(c *gin.Context, db *sql.DB) {
	boxes, err := services.GetBoxes(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve boxes"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"boxes": boxes})
}
