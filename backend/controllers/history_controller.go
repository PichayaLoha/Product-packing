package controllers

import (
	"database/sql"
	"go-backend/models"
	"go-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetHistory(c *gin.Context, db *sql.DB) {
	history, err := services.GetHistory(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve History"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"history": history})
}

func GetHistoryDetail(c *gin.Context, db *sql.DB) {
	id := c.Param("id")
	historyDetail, err := services.GetHistoryByID(db, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve history detail"})
		return
	}
	c.JSON(http.StatusOK, historyDetail)
}

func UpdateHistory(c *gin.Context, db *sql.DB) {
	var updatedHistory models.HistoryOrder

	historyID := c.Param("history_id")
	if err := c.ShouldBindJSON(&updatedHistory); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	if err := services.UpdateHistory(db, &updatedHistory, historyID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to update history",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "อัปเดตออเดอร์สำเร็จ",
		"history": updatedHistory,
	})
}

// func DeleteHistory(c *gin.Context, db *sql.DB) {
// 	productID := c.Param("history_id")

// 	rowsAffected, err := services.DeleteProduct(db, productID)
// 	if err != nil {
// 		log.Println("Error deleting history: ", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"error": "Unable to delete history",
// 		})
// 		return
// 	}

// 	if rowsAffected == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"error": "History not found",
// 		})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "History deleted successfully",
// 	})
// }
