package main

import (
	"fmt"
	"go-backend/config"
	"go-backend/database"
	"go-backend/models"
	"go-backend/routes"
	"log"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
)

func main() {
	fmt.Println("System Start")
	config.LoadConfig()
	db := database.InitDB()

	// AutoMigrate all models
	err := db.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.Box{},
		&models.Customer{},
		&models.Order{},
		&models.OrderDetail{},
		&models.History{},
		&models.PackageDel{},
		&models.PackageBoxDel{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	fmt.Println("Database migration successful")

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get underlying sql.DB: %v", err)
	}

	// No need to defer db.Close() with GORM v2, it manages connections automatically
	cld, err := initCloudinary()
	if err != nil {
		log.Fatalf("Failed to initialize Cloudinary: %v", err)
	}

	router := routes.Router(sqlDB, cld)
	router.Run(":8080")
}

func initCloudinary() (*cloudinary.Cloudinary, error) {
	return cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
}
