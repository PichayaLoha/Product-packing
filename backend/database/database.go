package database

import (
	"database/sql"
	"log"

	"go-backend/config"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() *sql.DB {
	db, err := sql.Open("postgres", config.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	DB = db
	return db
}
