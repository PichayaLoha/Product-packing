package middleware

import (
	"net/http"
	"strings"

	"go-backend/config"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Middleware ตรวจสอบ JWT Token
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")

		// ตรวจสอบว่า Header มีค่าและต้องมี "Bearer " นำหน้า
		if tokenString == "" || !strings.HasPrefix(tokenString, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token required"})
			c.Abort()
			return
		}

		// ตัด "Bearer " ออก
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		if IsTokenBlacklist(tokenString) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has been logged out"})
			c.Abort()
			return
		}
		// ตรวจสอบ JWT Token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return config.JwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Next()
	}
}
