package services

import (
	"database/sql"
	"fmt"
	"go-backend/models" // import models ที่สร้างไว้
	"log"
	"math"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func GenerateProduct(db *sql.DB, c *gin.Context) ([]*models.HistoryOrder, error) {
	var requestBody models.RequestBody

	if err := c.BindJSON(&requestBody); err != nil {
		log.Println("Error binding JSON: ", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
	}

	mode := requestBody.Mode
	// mode := "boxes"
	fmt.Println(mode)
	fmt.Println("Blocked Boxes:", requestBody.BlockedBoxes)
	rows, err := db.Query(`SELECT box_id, box_name, box_width, box_length, box_height, box_amount , box_maxweight, box_cost FROM boxes`)
	rows1, err1 := db.Query(`SELECT 
			od.order_del_id, p.product_id,
			p.product_name, p.product_width, p.product_length, 
			p.product_height, p.product_weight, p.product_cost, od.product_amount
		FROM order_dels od
		INNER JOIN products p ON od.product_id = p.product_id`)

	if err != nil {
		log.Println("Error querying boxes: ", err)
		return nil, err
	}
	defer rows.Close()

	if err1 != nil {
		log.Println("Error querying products: ", err1)
		return nil, err
	}
	// if !rows1.Next() {
	// 	log.Println("ไม่มีออเดอร์ในระบบ")
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่มีออเดอร์ในระบบ"})
	// 	return nil, nil
	// }
	defer rows1.Close()

	var boxSizes []models.Box
	var products []models.Product

	// สแกนข้อมูลจากตาราง boxes
	for rows.Next() {
		var box models.Box
		if err := rows.Scan(&box.BoxID, &box.BoxName, &box.BoxWidth, &box.BoxLength, &box.BoxHeight, &box.BoxAmount, &box.BoxMaxWeight, &box.BoxCost); err != nil {
			log.Println("Error scanning box row: ", err)
			return nil, err
		}
		boxSizes = append(boxSizes, box)

		sort.Slice(boxSizes, func(i, j int) bool {
			return boxSizes[i].BoxID < boxSizes[j].BoxID

		})
		// fmt.Println("boxSizes: ", boxSizes)
	}
	// fmt.Println("boxSizes: ", boxSizes)

	// สแกนข้อมูลจากตาราง products
	// for rows1.Next() {
	// 	var product models.Product
	// 	var order models.OrderDetail
	// 	var productAmount int
	// 	if err1 := rows1.Scan(&order.OrderDelID, &product.ProductID, &product.ProductName, &product.ProductWidth, &product.ProductLength, &product.ProductHeight, &product.ProductWeight, &productAmount); err1 != nil {
	// 		log.Println("Error scanning product row: ", err1)
	// 		return nil, err
	// 	}

	// 	// ลูปเพิ่มออเดอร์ตามจำนวน product_amount
	// 	for i := 0; i < productAmount; i++ {
	// 		products = append(products, product)
	// 	}
	// }
	for rows1.Next() {
		var product models.Product
		var order models.OrderDetail
		var productAmount int
		if err1 := rows1.Scan(&order.OrderDelID, &product.ProductID, &product.ProductName, &product.ProductWidth, &product.ProductLength, &product.ProductHeight, &product.ProductWeight, &product.ProductCost, &productAmount); err1 != nil {
			log.Println("Error scanning product row: ", err1)
			return nil, err
		}

		// ลูปเพิ่มออเดอร์ตามจำนวน product_amount
		for i := 0; i < productAmount; i++ {
			products = append(products, product)
		}
	}
	// เรียงลำดับ product
	sortProducts(products)
	fmt.Println("boxs: ", boxSizes)
	fmt.Println("products: ", products)
	availableBoxes := filterAvailableBoxes(boxSizes, requestBody.BlockedBoxes)
	boxes, totalProductCost, totalBoxCost, totalCost := packing(products, availableBoxes, mode) //อย่าลืมแก้กลับเป๋นเหมือนเดิม
	fmt.Printf("จำนวนกล่องที่ใช้: %d\n", len(boxes))
	var productgen []*models.HistoryOrder

	for i, box := range boxes {
		fmt.Printf("รายละเอียดกล่องที่ %d (ไซส์ %s):\n", i+1, box.Size.BoxName)
		historyOrder := &models.HistoryOrder{
			BoxName:  box.Size.BoxName,
			Products: box.Products,
		}
		productgen = append(productgen, historyOrder)
		for j, product := range box.Products {
			fmt.Printf("ออเดอร์ %d %s(ยาว: %.1f, สูง: %.1f, กว้าง: %.1f น้ำหนัก: %.1f) ตำแหน่ง (x: %.1f, y: %.1f, z: %.1f)\n",
				j+1, product.ProductName, product.ProductLength, product.ProductHeight, product.ProductWidth, product.ProductWeight, product.X, product.Y, product.Z)
		}
	}

	// อัปเดตจำนวนกล่องที่เหลือในฐานข้อมูล
	for _, box := range boxes {
		_, err := db.Exec(`UPDATE boxes SET box_amount = box_amount - 1 WHERE box_name = $1`, box.Size.BoxName)
		if err != nil {
			log.Println("Error updating box amount: ", err)
			return nil, err
		}
	}
	for _, products := range boxes {
		for _, product := range products.Products {
			_, err := db.Exec(`UPDATE products SET product_amount = product_amount - 1 WHERE product_name = $1`, product.ProductName)
			if err != nil {
				log.Println("Error updating box amount: ", err)
				return nil, err
			}
		}
	}

	var historyID int
	historyOrder := models.HistoryOrder{HistoryStatus: "Unpacked"}

	// ✅ ดึง `customer_id` ล่าสุดจาก database
	var customerID int
	queryLastCustomer := `SELECT customer_id FROM customers ORDER BY customer_id DESC LIMIT 1`
	err = db.QueryRow(queryLastCustomer).Scan(&customerID)
	if err != nil {
		log.Println("Error retrieving latest customer_id:", err)
		return nil, err
	}

	fmt.Println("Latest customer_id:", customerID)

	// ✅ ใช้ `customer_id` ที่เพิ่งสร้างในการ INSERT `packages_order`
	queryHistoryOrder := `INSERT INTO packages_order (package_time, package_amount, package_status, package_product_cost, package_box_cost, package_total_cost, customer_id)
                      VALUES (NOW(), $1, $2, $3, $4, $5, $6)
                      RETURNING package_id`
	err = db.QueryRow(queryHistoryOrder, len(boxes), historyOrder.HistoryStatus, totalProductCost, totalBoxCost, totalCost, customerID).Scan(&historyID)
	if err != nil {
		log.Println("Error inserting into packages_order:", err)
		return nil, err
	}
	fmt.Println("Created package_id:", historyID)

	for _, historyProduct := range productgen {
		// fmt.Println("historyProduct : ", historyProduct.Products)
		var genboxDelID int
		queryHistoryDel := `INSERT INTO package_dels (package_del_boxsize, package_id) 
							VALUES ($1, $2) 
							RETURNING package_del_id`
		err = db.QueryRow(queryHistoryDel, historyProduct.BoxName, historyID).Scan(&genboxDelID)
		fmt.Println("package_dels_test:", historyProduct.BoxName, historyID)

		if err != nil {
			log.Println("Error inserting into package_dels:", err)
			return nil, err
		}

		for _, historyProduct1 := range historyProduct.Products {
			fmt.Println("ProductID: ", historyProduct1.ProductID)

			// เตรียมคำสั่ง SQL สำหรับ Insert
			query := `
				INSERT INTO package_box_dels (package_box_x, package_box_y, package_box_z, package_del_id, product_id) 
				VALUES ($1, $2, $3, $4, $5) 
				RETURNING package_box_id` // เปลี่ยน "package_box_dels" เป็น primary key หรือ field ที่ต้องการ

			var genBoxDelID int

			// ดำเนินการ Query และตรวจสอบข้อผิดพลาด
			err1 := db.QueryRow(query,
				historyProduct1.X,
				historyProduct1.Y,
				historyProduct1.Z,
				genboxDelID,
				historyProduct1.ProductID,
			).Scan(&genBoxDelID)

			if err1 != nil {
				log.Printf("Error inserting into package_box_dels (ProductID: %d): %v", historyProduct1.ProductID, err1)
				return nil, err1
			}

			fmt.Printf("Inserted package_box_dels with ID: %d\n", genBoxDelID)
		}

	}
	// query := `DELETE FROM order_dels`
	// result, err := db.Exec(query)
	// if err != nil {
	// 	log.Println("Error deleting order details: ", err)
	// }

	// rowsAffected, err := result.RowsAffected()
	// if err != nil {
	// 	log.Println("Error getting rows affected: ", err)
	// } else {
	// 	log.Println("Rows affected: ", rowsAffected)
	// }

	fmt.Println("productgen: ", productgen)
	return productgen, nil
}
func calculateBoxWeight(products []models.Product) float64 {
	totalWeight := 0.0
	for _, product := range products {
		totalWeight += product.ProductWeight
	}
	return totalWeight
}
func filterAvailableBoxes(allBoxes []models.Box, blockedBoxes []int) []models.Box {
	available := []models.Box{}
	blockedSet := make(map[int]bool)

	// สร้าง map สำหรับกล่องที่ถูกบล็อก
	for _, id := range blockedBoxes {
		blockedSet[id] = true
	}

	// กรองกล่องที่ไม่ได้ถูกบล็อก
	for _, box := range allBoxes {
		if !blockedSet[box.BoxID] {
			available = append(available, box)
		}
	}

	return available
}
func packing(products []models.Product, boxSizes []models.Box, mode string) ([]models.PackedBox, float64, float64, float64) {
	var boxes []models.PackedBox
	remainingProducts := products
	totalCost := 0.0
	totalProductCost := 0.0
	totalBoxCost := 0.0

	// 🛠 ใช้ map เก็บจำนวนกล่องที่ใช้จริง
	boxUsage := make(map[string]int)

	for len(remainingProducts) > 0 {
		// ตรวจสอบว่าน้ำหนักของสินค้า
		product := remainingProducts[0]
		canPack := false

		for _, box := range boxSizes {
			if product.ProductWeight <= box.BoxMaxWeight {
				canPack = true
				break
			}
		}

		if !canPack {
			fmt.Printf("ไม่มีกล่องที่สามารถรองรับน้ำหนักของสินค้า %s ได้ (น้ำหนัก: %.2f)\n", product.ProductName, product.ProductWeight)
			remainingProducts = remainingProducts[1:] // ลบสินค้าที่ไม่สามารถแพ็คได้ออก
			continue
		}

		bestFitIndex := -1
		for i, box := range boxes {
			pos, canPlace := canPlace(box.Products, remainingProducts[0], box.Size.BoxWidth, box.Size.BoxHeight, box.Size.BoxLength)
			currentBoxWeight := calculateBoxWeight(box.Products)

			if canPlace && currentBoxWeight+remainingProducts[0].ProductWeight <= box.Size.BoxMaxWeight {
				bestFitIndex = i
				remainingProducts[0].X, remainingProducts[0].Y, remainingProducts[0].Z = pos[0], pos[1], pos[2]
				break
			}
		}

		if bestFitIndex != -1 {
			boxes[bestFitIndex].Products = append(boxes[bestFitIndex].Products, remainingProducts[0])
			remainingProducts = remainingProducts[1:]
		} else {
			newBoxSize, found := findSuitableBoxSize(remainingProducts[0], boxSizes, remainingProducts, mode)
			if found {
				remainingProducts[0].X, remainingProducts[0].Y, remainingProducts[0].Z = 0, 0, 0
				newBox := models.PackedBox{Size: newBoxSize, Products: []models.Product{remainingProducts[0]}}

				// ✅ นับจำนวนกล่องที่ใช้จริง
				boxUsage[newBox.Size.BoxName]++

				boxes = append(boxes, newBox)
				remainingProducts = remainingProducts[1:]
			} else {
				fmt.Println("ไม่พบกล่องที่สามารถบรรจุสินค้านี้ได้:", remainingProducts[0].ProductName)
				break
			}
		}
	}

	// คำนวณtotalBoxCostตามจำนวนกล่องที่ใช้จริง
	for _, box := range boxSizes {
		if count, exists := boxUsage[box.BoxName]; exists {
			totalBoxCost += box.BoxCost * float64(count)
		}
	}

	// ✅ คำนวณ `totalProductCost`
	for _, box := range boxes {
		for _, product := range box.Products {
			totalProductCost += product.ProductCost
		}
	}

	// ✅ คำนวณ `totalCost`
	totalCost = totalProductCost + totalBoxCost

	fmt.Printf("📦 ราคารวมของสินค้าทั้งหมด: %.2f\n", totalProductCost)
	fmt.Printf("📦 ราคารวมของกล่องที่ใช้: %.2f\n", totalBoxCost)
	fmt.Printf("📦 ราคารวมทั้งหมด: %.2f\n", totalCost)

	return boxes, totalProductCost, totalBoxCost, totalCost
}

func findSuitableBoxSize(product models.Product, boxSizes []models.Box, products []models.Product, mode string) (models.Box, bool) {
	var selectedBox models.Box
	maxFitCount := 0.0
	maxFitVol := 0.0
	minRemain := -1.0
	found := false
	productSameSize := areProductsSameSize(products)
	productCount := float64(len(products))

	for _, size := range boxSizes {
		boxVol := size.BoxWidth * size.BoxHeight * size.BoxLength
		fitCount := calculateFitCount(product, size.BoxWidth, size.BoxHeight, size.BoxLength)
		productVol := calculateProductVolume(products)
		// ตรวจสอบเงื่อนไขน้ำหนักก่อน
		if product.ProductWeight <= size.BoxMaxWeight {
			if mode == "boxes" {
				// ตรวจสอบว่าขนาดกล่องสามารถใส่สินค้าได้
				if size.BoxAmount > 0 && size.BoxWidth >= product.ProductWidth && size.BoxHeight >= product.ProductHeight && size.BoxLength >= product.ProductLength {
					// กรณีสินค้าขนาดเท่ากัน
					if productSameSize {
						if fitCount >= productCount {
							selectedBox = size
							found = true
							break
						} else if fitCount > maxFitCount && fitCount <= productCount {
							selectedBox = size
							maxFitCount = fitCount
							found = true
						}
					} else {
						// กรณีสินค้าขนาดไม่เท่ากัน คำนวณพื้นที่ที่สามารถใส่ได้
						if boxVol >= productVol {
							selectedBox = size
							found = true
							break
						} else if boxVol > maxFitVol && boxVol <= productVol {
							selectedBox = size
							maxFitVol = boxVol
							found = true
						}
					}
				}
			} else if mode == "space" {
				// ตรวจสอบให้เหลือพื้นที่น้อยที่สุด
				productVolByOne := fitCount * (product.ProductWidth * product.ProductHeight * product.ProductLength)
				boxRemain := 0.0

				if size.BoxAmount > 0 && size.BoxWidth >= product.ProductWidth && size.BoxHeight >= product.ProductHeight && size.BoxLength >= product.ProductLength {
					if productSameSize {
						if fitCount >= productCount {
							productVolByOne = productCount * (product.ProductWidth * product.ProductHeight * product.ProductLength)
						}
						if productVolByOne <= boxVol {
							boxRemain = boxVol - productVolByOne
							if minRemain == -1 || (minRemain >= 0 && boxRemain <= minRemain) {
								selectedBox = size
								minRemain = boxRemain
								found = true
							}
						}
					} else {
						boxRemain = boxVol - productVol
						if minRemain == -1 || (minRemain >= 0 && boxRemain <= minRemain) {
							selectedBox = size
							minRemain = boxRemain
							found = true
						}
					}
				}
			}
		}
	}

	if found {
		for i := range boxSizes {
			if boxSizes[i].BoxName == selectedBox.BoxName {
				boxSizes[i].BoxAmount--
				break
			}
		}
	}

	return selectedBox, found
}

func areProductsSameSize(products []models.Product) bool {
	if len(products) == 0 {
		return true
	}
	first := products[0]
	for _, product := range products[1:] {
		if product.ProductWidth != first.ProductWidth || product.ProductHeight != first.ProductHeight || product.ProductLength != first.ProductLength {
			return false
		}
	}
	return true
}

func calculateFitCount(product models.Product, boxWidth, boxHeight, boxLong float64) float64 {
	countWidth := boxWidth / product.ProductWidth
	countHeight := boxHeight / product.ProductHeight
	countLong := boxLong / product.ProductLength
	// fmt.Println("countWidth: ", countWidth)
	// fmt.Println("countHeight: ", countHeight)
	// fmt.Println("countLong: ", countLong)
	return math.Floor(countWidth) * math.Floor(countHeight) * math.Floor(countLong)
}

func calculateProductVolume(box []models.Product) float64 {
	usedVolume := 0.0
	for _, product := range box {
		usedVolume += product.ProductWidth * product.ProductHeight * product.ProductLength
	}

	return usedVolume
}

func canPlace(box []models.Product, product models.Product, boxWidth, boxHeight, boxLong float64) ([3]float64, bool) {
	for x := 0.0; x <= boxLong-product.ProductLength; x++ {
		for y := 0.0; y <= boxHeight-product.ProductHeight; y++ {
			for z := 0.0; z <= boxWidth-product.ProductWidth; z++ {
				if position(box, product, x, y, z) {
					return [3]float64{x, y, z}, true
				}
			}
		}
	}
	return [3]float64{}, false
}
func position(box []models.Product, product models.Product, x, y, z float64) bool {
	for _, placedProduct := range box {
		if !(x+product.ProductLength <= placedProduct.X ||
			x >= placedProduct.X+placedProduct.ProductLength ||
			y+product.ProductHeight <= placedProduct.Y ||
			y >= placedProduct.Y+placedProduct.ProductHeight ||
			z+product.ProductWidth <= placedProduct.Z ||
			z >= placedProduct.Z+placedProduct.ProductWidth) {
			return false
		}
	}
	return true
}

func sortProducts(products []models.Product) {
	sort.Slice(products, func(i, j int) bool {
		if products[i].ProductWeight != products[j].ProductWeight {
			return products[i].ProductWeight > products[j].ProductWeight
		}
		return products[i].ProductWidth*products[i].ProductHeight*products[i].ProductLength > products[j].ProductWidth*products[j].ProductHeight*products[j].ProductLength
	})
}
