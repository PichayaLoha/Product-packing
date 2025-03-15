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

// ฟังก์ชันดึงข้อมูลกล่องทั้งหมด
func GetBoxes(c *gin.Context, db *sql.DB) {
	boxes, err := services.GetBoxes(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve boxes"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"boxes": boxes})
}

func GetBoxesByID(c *gin.Context, db *sql.DB) {
	boxID := c.Param("box_id")
	fmt.Println("boxID: ", boxID)
	boxes, err := services.GetBoxesByID(db, boxID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve boxes"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"boxes": boxes})
}

func CreateBoxes(c *gin.Context, db *sql.DB) {
	var newBox models.Box

	// อ่าน JSON จาก request
	if err := c.ShouldBindJSON(&newBox); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// newOrderdel.OrderDelDate = time.Now()
	if err := services.CreateBoxes(db, &newBox); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create box"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "เพิ่มออเดอร์ใหม่สำเร็จ",
		"box":     newBox,
	})
}

func UpdateBoxes(c *gin.Context, db *sql.DB) {
	var updatedBox models.Box

	boxID := c.Param("box_id")

	if err := c.ShouldBindJSON(&updatedBox); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	// updatedProduct.ProductTime = time.Now()

	if err := services.UpdateBoxes(db, &updatedBox, boxID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to update box",
		})
		return
	}
	updatedBox.BoxID, _ = strconv.Atoi(boxID)
	c.JSON(http.StatusOK, gin.H{
		"message": "อัปเดตออเดอร์สำเร็จ",
		"box":     updatedBox,
	})
}

func DeleteBoxes(c *gin.Context, db *sql.DB) {
	boxID := c.Param("box_id")

	rowsAffected, err := services.DeleteBoxes(db, boxID)
	if err != nil {
		log.Println("Error deleting box: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to delete box",
		})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Box not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Box deleted successfully",
	})
}
