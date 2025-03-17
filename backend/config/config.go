package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var JwtSecret []byte
var DatabaseURL string

func LoadConfig() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))
	DatabaseURL = os.Getenv("DATABASE_URL")
}
