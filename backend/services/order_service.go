package services

import (
	"database/sql"
	"go-backend/models"
	"log"
	"time"
)

// OrderDetailResponse is a struct that combines OrderDetail and Product information for client responses.
type OrderDetailResponse struct {
	models.OrderDetail
	Product models.Product `json:"product"`
}

func GetOrderdels(db *sql.DB) ([]OrderDetailResponse, error) {
	rows, err := db.Query(`
        SELECT 
            od.order_del_id, od.product_amount, od.product_id, od.order_del_date,
            p.product_name, p.product_height, p.product_length, p.product_width,
            p.product_time, p.product_amount, p.product_weight, p.product_cost,
            p.user_id, p.product_image
        FROM order_dels od
        INNER JOIN products p ON od.product_id = p.product_id
    `)
	if err != nil {
		log.Println("Error querying orders: ", err)
		return nil, err
	}
	defer rows.Close()

	var orderdels []OrderDetailResponse

	for rows.Next() {
		var res OrderDetailResponse

		if err := rows.Scan(
			&res.OrderDelID, &res.ProductAmount, &res.ProductID, &res.OrderDelDate,
			&res.Product.ProductName, &res.Product.ProductHeight, &res.Product.ProductLength, &res.Product.ProductWidth,
			&res.Product.ProductTime, &res.Product.ProductAmount, &res.Product.ProductWeight, &res.Product.ProductCost,
			&res.Product.UserID, &res.Product.ProductImage,
		); err != nil {
			log.Println("Error scanning order row: ", err)
			return nil, err
		}

		// Set the product ID in the nested product struct as well
		res.Product.ProductID = res.ProductID
		orderdels = append(orderdels, res)
	}

	return orderdels, nil
}

func CreateOrderdels(db *sql.DB, newOrderdel *models.OrderDetail) error {

	newOrderdel.OrderDelDate = time.Now()

	query := `INSERT INTO order_dels (product_amount, product_id, order_del_date) 
               VALUES ($1, $2, $3) 
               RETURNING order_del_id`
	err := db.QueryRow(query, newOrderdel.ProductAmount, newOrderdel.ProductID, newOrderdel.OrderDelDate).Scan(&newOrderdel.OrderDelID)

	if err != nil {
		log.Println("Error inserting product: ", err)
		return err
	}
	return nil

}

func DeleteOrderDel(db *sql.DB, orderdelID string) (int64, error) {
	// ลบ order_del
	queryDelete := `DELETE FROM order_dels WHERE order_del_id = $1`
	result, err := db.Exec(queryDelete, orderdelID)
	if err != nil {
		log.Println("Error deleting orderdel: ", err)
		return 0, err
	}

	// ตรวจสอบจำนวนแถวที่ถูกลบ
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("Error getting rows affected: ", err)
		return 0, err
	}

	return rowsAffected, nil
}