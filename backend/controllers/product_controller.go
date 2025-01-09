package controllers

import (
	"database/sql"
	"fmt"
	"go-backend/models"
	"go-backend/services"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context, db *sql.DB) {
	products, err := services.GetProducts(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve products"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"products": products})
}

func GetProductsByID(c *gin.Context, db *sql.DB) {
	productID := c.Param("product_id")
	fmt.Println("productID: ", productID)
	products, err := services.GetProductsByID(db, productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve products"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"products": products})
}

func CreateProduct(c *gin.Context, db *sql.DB) {
	var newProduct models.Product

	if err := c.ShouldBindJSON(&newProduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	newProduct.ProductTime = time.Now()

	if err := services.CreateProduct(db, &newProduct); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create product"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "เพิ่มออเดอร์ใหม่สำเร็จ", "product": newProduct})
}

func UpdateProduct(c *gin.Context, db *sql.DB) {
	var updatedProduct models.Product

	productID := c.Param("product_id")
	fmt.Println("productID: ", productID)
	fmt.Println(updatedProduct)
	if err := c.ShouldBindJSON(&updatedProduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	updatedProduct.ProductTime = time.Now()

	if err := services.UpdateProduct(db, &updatedProduct, productID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to update product",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "อัปเดตออเดอร์สำเร็จ",
		"product": updatedProduct,
	})
}

func DeleteProduct(c *gin.Context, db *sql.DB) {
	productID := c.Param("product_id")

	rowsAffected, err := services.DeleteProduct(db, productID)
	if err != nil {
		log.Println("Error deleting product: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to delete product",
		})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Product not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
	})
}

func GenerateProduct(c *gin.Context, db *sql.DB) {
	genproduct, err := services.GenerateProduct(db, c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to generate product",
		})
		log.Printf("Error generating product: %v\n", err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"genproduct": genproduct,
	})
}
