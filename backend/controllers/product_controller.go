package controllers

import (
	"database/sql"
	"go-backend/models"
	"go-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context, db *sql.DB) {
	products, err := services.GetProducts(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

func GetProductsByID(c *gin.Context, db *sql.DB) {
	productID := c.Param("product_id")
	product, err := services.GetProductsByID(db, productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, product)
}

func CreateProduct(c *gin.Context, db *sql.DB) {
	var newProduct models.Product
	if err := c.ShouldBindJSON(&newProduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Assign the UserID from the context (assuming it's set by auth middleware)
	// For now, we'll use a placeholder or assume it's part of the request body if not from auth.
	// If you have an authentication middleware that sets c.Set("userID", someID), you can use:
	// if userID, exists := c.Get("userID"); exists {
	// 	newProduct.UserID = userID.(int)
	// }

	err := services.CreateProduct(db, &newProduct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, newProduct)
}

func UpdateProduct(c *gin.Context, db *sql.DB) {
	productID := c.Param("product_id")
	var updatedProduct models.Product
	if err := c.ShouldBindJSON(&updatedProduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := services.UpdateProduct(db, &updatedProduct, productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return	}
	c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
}

func DeleteProduct(c *gin.Context, db *sql.DB) {
	productID := c.Param("product_id")
	rowsAffected, err := services.DeleteProduct(db, productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func GenerateProduct(c *gin.Context, db *sql.DB) {
	var req services.OrderGenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Fetch products and boxes from the database based on IDs in the request if needed
	// For simplicity, assuming req.Products and req.Boxes are already populated with full data

	packingResult, err := services.GeneratePackingSolution(db, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// After generating, you might want to save this history. This is a placeholder.
	// historyID, err := services.CreateHistoryFromOrder(db, packingResult, req.UserID)
	// if err != nil {
	// 	log.Printf("Error saving history: %v", err)
	// 	// Decide how to handle this error - return it or just log and continue
	// }

	c.JSON(http.StatusOK, packingResult)
}
