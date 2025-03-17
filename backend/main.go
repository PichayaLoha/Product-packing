package main

import (
	"fmt"
	"go-backend/config"
	"go-backend/database"
	"go-backend/routes"
)

func main() {
	fmt.Println("System Start")
	config.LoadConfig()
	db := database.InitDB()
	defer db.Close()
	router := routes.Router(db)
	router.Run(":8080")
}
