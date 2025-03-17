package controllers

import (
	"database/sql"
	"fmt"
	"go-backend/models"
	"go-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateUsers(c *gin.Context, db *sql.DB) {
	var newUser models.User
	fmt.Println("เข้าcontroller มาแล้ว")
	// อ่าน JSON จาก request
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := services.CreateUsers(db, &newUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "เพิ่มผู้ใช้ใหม่สำเร็จ",
		"user":    newUser,
	})
}
