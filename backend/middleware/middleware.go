package middleware

import (
	"time"

	"go-backend/config"

	"github.com/golang-jwt/jwt/v5"
)

// Generate JWT Token
func GenerateToken(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 2).Unix(),
		// "exp": time.Now().Add(50 * time.Second).Unix(),
	})
	return token.SignedString(config.JwtSecret)
}
