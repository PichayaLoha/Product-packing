package controllers

import (
	"database/sql"
	"go-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetHistory(c *gin.Context, db *sql.DB) {
	histories, err := services.GetHistory(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, histories)
}

func GetHistoryDetail(c *gin.Context, db *sql.DB) {
	historyID := c.Param("id")
	history, err := services.GetHistoryDetail(db, historyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, history)
}

func GetHistoryBoxDetail(c *gin.Context, db *sql.DB) {
	historyBoxDelID := c.Param("hisroryboxdel_id")
	boxDetails, err := services.GetHistoryBoxDetail(db, historyBoxDelID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, boxDetails)
}

func UpdateHistory(c *gin.Context, db *sql.DB) {
	historyID := c.Param("history_id")
	var requestBody struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := services.UpdateHistory(db, historyID, requestBody.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "History updated successfully"})
}

func DeleteHistory(c *gin.Context, db *sql.DB) {
	historyID := c.Param("history_id")

	err := services.DeleteHistory(db, historyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "History deleted successfully"})
}