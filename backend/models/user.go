package models

type User struct {
	UserID           int    `json:"user_id"`
	UserName         string `json:"user_name"`
	UserPassword     string `json:"user_password"`
	UserPasswordHash string `json:"user_passwordhash"`
	UserFirstName    string `json:"user_firstname"`
	UserLastName     string `json:"user_lastname"`
}
