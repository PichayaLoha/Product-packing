package models

type User struct {
	UserID           int    `gorm:"primaryKey;autoIncrement" json:"user_id"`
	UserName         string `gorm:"type:varchar(12);not null" json:"user_name"`
	UserPassword     string `gorm:"-" json:"user_password,omitempty"`
	UserPasswordHash string `json:"-"`
	UserFirstName    string `json:"user_firstname"`
	UserLastName     string `json:"user_lastname"`
	UserRole         string `gorm:"type:varchar(255)" json:"user_role"`
}
