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

	//GET
	router.GET("/api/products", func(c *gin.Context) {
		controllers.GetProducts(c, db)
	})

	router.GET("/api/products/:product_id", func(c *gin.Context) {
		controllers.GetProductsByID(c, db)
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
	// router.GET("/api/orders", func(c *gin.Context) {
	// 	controllers.GetOrders(c, db)
	// })
	router.GET("/api/orderdels", func(c *gin.Context) {
		controllers.GetOrderdels(c, db)
	})
	// router.GET("/api/orderdels", func(c *gin.Context) {
	// 	controllers.GetOrderdels(c, db)
	// })

	// router.GET("/api/orders/:order_id", func(c *gin.Context) {
	// 	controllers.GetOrdersByID(c, db)
	// })
	//POST
	router.POST("/api/products", func(c *gin.Context) {
		controllers.CreateProduct(c, db)
	})

	router.POST("/api/orders", func(c *gin.Context) {
		controllers.CreateOrders(c, db) // เรียกใช้ฟังก์ชันที่อยู่ใน controllers
	})

	router.POST("/api/generate", func(c *gin.Context) {
		controllers.GenerateProduct(c, db)
	})

	//DELETE
	router.DELETE("/api/products/:product_id", func(c *gin.Context) {
		controllers.DeleteProduct(c, db)
	})

	router.DELETE("/api/orderdels/:order_del_id", func(c *gin.Context) {
		controllers.DeleteOrderDel(c, db)
	})

	// router.DELETE("/api/history/:history_id", func(c *gin.Context) {
	// 	controllers.DeleteHistory(c, db)
	// })

	//PUT
	router.PUT("/api/products/:product_id", func(c *gin.Context) {
		controllers.UpdateProduct(c, db)
	})

	router.PUT("/api/history/:history_id", func(c *gin.Context) {
		controllers.UpdateHistory(c, db)
	})

	router.Run(":8080")
}
