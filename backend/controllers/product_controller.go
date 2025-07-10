package controllers

import (
	"context"
	"database/sql"
	"go-backend/models"
	"go-backend/services"
	"net/http"
	"strconv"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
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

func CreateProduct(c *gin.Context, db *sql.DB, cld *cloudinary.Cloudinary) {
	// Parse form values
	productName := c.PostForm("product_name")
	productHeightStr := c.PostForm("product_height")
	productLengthStr := c.PostForm("product_length")
	productWidthStr := c.PostForm("product_width")
	productAmountStr := c.PostForm("product_amount")
	productWeightStr := c.PostForm("product_weight")
	productCostStr := c.PostForm("product_cost")

	// Use UserID from auth middleware if available, otherwise from form
	var userID int
	if id, exists := c.Get("userID"); exists {
		var ok bool
		userID, ok = id.(int)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid userID type in context"})
			return
		}
	} else {
		userIDStr := c.PostForm("user_id")
		var err error
		userID, err = strconv.Atoi(userIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or missing user ID"})
			return
		}
	}

	// Handle file upload to Cloudinary
	file, err := c.FormFile("product_image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product image is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file"})
		return
	}
	defer src.Close()

	// Upload to Cloudinary
	uploadParams := uploader.UploadParams{
		Folder: "product-packing",
	}
	uploadResult, err := cld.Upload.Upload(context.Background(), src, uploadParams)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file to Cloudinary"})
		return
	}

	// Convert string values to appropriate types
	productHeight, err := strconv.ParseFloat(productHeightStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product height: " + err.Error()})
		return
	}
	productLength, err := strconv.ParseFloat(productLengthStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product length: " + err.Error()})
		return
	}
	productWidth, err := strconv.ParseFloat(productWidthStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product width: " + err.Error()})
		return
	}
	productAmount, err := strconv.Atoi(productAmountStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product amount: " + err.Error()})
		return
	}
	productWeight, err := strconv.ParseFloat(productWeightStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product weight: " + err.Error()})
		return
	}
	productCost, err := strconv.ParseFloat(productCostStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product cost: " + err.Error()})
		return
	}

	// Create Product instance
	newProduct := models.Product{
		ProductName:   productName,
		ProductHeight: productHeight,
		ProductLength: productLength,
		ProductWidth:  productWidth,
		ProductTime:   time.Now(),
		ProductAmount: productAmount,
		ProductWeight: productWeight,
		ProductCost:   productCost,
		UserID:        userID,
		ProductImage:  uploadResult.SecureURL, // Save the Cloudinary URL
	}

	// Call the service to create the product in the database
	if err := services.CreateProduct(db, &newProduct); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product: " + err.Error()})
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
		return
	}
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
