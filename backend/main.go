package main

import (
	"fmt"
	"go-backend/controllers"
	"go-backend/database"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("System")
	db := database.InitDB()
	defer db.Close()

	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/api/products", func(c *gin.Context) {
		controllers.GetProducts(c, db)
	})

	router.GET("/api/products/:product_id", func(c *gin.Context) {
		controllers.GetProductsByID(c, db)
	})
	router.PUT("/api/products/:product_id", func(c *gin.Context) {
		controllers.UpdateProduct(c, db)
	})

	router.DELETE("/api/products/:product_id", func(c *gin.Context) {
		controllers.DeleteProduct(c, db)
	})

	router.POST("/api/products", func(c *gin.Context) {
		controllers.CreateProduct(c, db)
	})

	router.GET("/api/boxes", func(c *gin.Context) {
		controllers.GetBoxes(c, db)
	})

	router.GET("/api/history", func(c *gin.Context) {
		controllers.GetHistory(c, db)
	})
	router.GET("/api/history/:id", func(c *gin.Context) {
		controllers.GetHistoryDetail(c, db)
	})

	router.POST("/api/generate", func(c *gin.Context) {
		controllers.GenerateProduct(c, db)
	})

	router.PUT("/api/history/:history_id", func(c *gin.Context) {
		controllers.UpdateHistory(c, db)
	})

	router.GET("/api/orders", func(c *gin.Context) {
		controllers.GetOrders(c, db)
	})

	router.POST("/api/orders", func(c *gin.Context) {
		controllers.CreateOrders(c, db)
	})
	// router.DELETE("/api/history/:history_id", func(c *gin.Context) {
	// 	controllers.DeleteHistory(c, db)
	// })

	router.Run(":8080")
}
