package services

import (
	"database/sql"
	"fmt"
	"go-backend/middleware"
	"go-backend/models"
	"log"
)

// ฟังก์ชันเพิ่ม User ลง Database
func CreateUsers(db *sql.DB, newUser *models.User) error {
	// แปลงรหัสผ่านเป็น Hash
	fmt.Println("เข้าservie มาแล้ว")
	hashedPassword, err := middleware.HashPassword(newUser.UserPassword)
	if err != nil {
		return fmt.Errorf("Error hashing password: %v", err)
	}

	// เพิ่ม User ลง Database
	_, err = db.Exec("INSERT INTO users (user_name, user_password_hash, user_first_name, user_last_name, user_role) VALUES ($1, $2, $3, $4, $5)",
		newUser.UserName, hashedPassword, newUser.UserFirstName, newUser.UserLastName, newUser.UserRole)

	if err != nil {
		log.Println("Error inserting user:", err)
		return err
	}

	log.Println("User created successfully! Username:", newUser.UserName)
	return nil
}
