// src/utils/auth.ts
export interface AuthToken {
    value: string;
    expiry: number;
}

export const setToken = (token: string, expiresInMinutes: number): void => {
    const now = new Date();
    const item: AuthToken = {
        value: token,
        expiry: now.getTime() + expiresInMinutes * 60 * 1000, // คำนวณเวลาหมดอายุ
    };
    localStorage.setItem("authToken", JSON.stringify(item));
};

// ฟังก์ชันดึง Token
export const getToken = (): string | null => {
    const itemStr = localStorage.getItem("authToken");
    if (!itemStr) return null;

    const item: AuthToken = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem("authToken");
        return null;
    }
    return item.value;
};

// ฟังก์ชันลบ Token
export const removeToken = (): void => {
    localStorage.removeItem("authToken");
};
