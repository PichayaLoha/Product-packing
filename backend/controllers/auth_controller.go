package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"go-backend/middleware"
	"go-backend/models"
	"github.com/gin-gonic/gin"
)

// ฟังก์ชัน Login
func Login(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"user_name"`
			Password string `json:"user_password"`
		}
		var user models.User

		// รับ JSON Request
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		// ค้นหา user ใน database
		err := db.QueryRow("SELECT user_id, user_name, user_passwordhash, user_role FROM users WHERE user_name = $1", req.Username).
			Scan(&user.UserID, &user.UserName, &user.UserPasswordHash, &user.UserRole)

		fmt.Println(user.UserID, user.UserName, user.UserPasswordHash, user.UserRole)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		// ตรวจสอบรหัสผ่าน (ใช้ bcrypt)
		if !middleware.CheckPassword(user.UserPasswordHash, req.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}

		// สร้าง JWT Token
		token, err := middleware.GenerateToken(user.UserName)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
			return
		}

		//ส่ง `user_id` และ `token` กลับไป
		c.JSON(http.StatusOK, gin.H{
			"token":   token,
			"user_id": user.UserID,
			"user_role":    user.UserRole,
		})
	}
}

func Logout(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")

	if tokenString == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token required"})
		return
	}

	// ตัด "Bearer " ออก
	// tokenString = tokenString[7:]
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	middleware.BlacklistToken(tokenString)

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully!"})
}
