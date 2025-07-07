package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var JwtSecret []byte
var DatabaseURL string

func LoadConfig() {
	

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))
	DatabaseURL = os.Getenv("DATABASE_URL")
}
