package controllers

import (
	"database/sql"
	"fmt"
	"go-backend/models"
	"go-backend/services"
	"log"
	"net/http"
	"strconv"
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

	// รับค่า Form-Data
	newProduct.ProductName = c.PostForm("product_name")
	newProduct.ProductHeight, _ = strconv.ParseFloat(c.PostForm("product_height"), 64)
	newProduct.ProductLength, _ = strconv.ParseFloat(c.PostForm("product_length"), 64)
	newProduct.ProductWidth, _ = strconv.ParseFloat(c.PostForm("product_width"), 64)
	newProduct.ProductAmount, _ = strconv.Atoi(c.PostForm("product_amount"))
	newProduct.ProductWeight, _ = strconv.ParseFloat(c.PostForm("product_weight"), 64)
	newProduct.ProductCost, _ = strconv.ParseFloat(c.PostForm("product_cost"), 64)
	newProduct.UserId, _ = strconv.Atoi(c.PostForm("user_id"))

	//รับไฟล์จาก Form-Data
	file, err := c.FormFile("product_image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาอัปโหลดรูปภาพ"})
		return
	}

	// เปิดไฟล์
	fileOpen, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเปิดไฟล์"})
		return
	}
	defer fileOpen.Close()

	//ตั้งชื่อไฟล์ใหม่
	fileName := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)
	fmt.Println("fileName: ", fileName)
	//อัปโหลดไป Cloudinary
	imageURL, err := services.UploadToCloudinary(fileOpen, fileName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "อัปโหลดรูปไป Cloudinary ล้มเหลว"})
		return
	}

	// 🖼 เก็บ URL ลง Database
	newProduct.ProductImage = imageURL
	newProduct.ProductTime = time.Now()

	// ✅ บันทึกสินค้า
	if err := services.CreateProduct(db, &newProduct); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเพิ่มสินค้าได้"})
		return
	}

	// 🎉 ตอบกลับ
	c.JSON(http.StatusCreated, gin.H{
		"message":   "เพิ่มสินค้าเรียบร้อย",
		"product":   newProduct,
		"image_url": imageURL,
	})
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
	updatedProduct.ProductID, _ = strconv.Atoi(productID)
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
