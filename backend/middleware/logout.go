package middleware

import (
	"sync"
)

var (
	tokenBlacklist = make(map[string]bool)
	mu             sync.Mutex //ตัว lock เพื่อไม่ให้เกิดการทับซ้อน
)

// เพิ่มTokenลงBlacklist
func BlacklistToken(token string) {
	mu.Lock()
	defer mu.Unlock()
	tokenBlacklist[token] = true
}

// เช็คว่าTokenอยู่ในBlacklistมั้ย
func IsTokenBlacklist(token string) bool {
	mu.Lock()
	defer mu.Unlock()
	return tokenBlacklist[token]
}
