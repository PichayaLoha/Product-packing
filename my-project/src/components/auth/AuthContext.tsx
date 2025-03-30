// src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken as saveToken, removeToken } from "./auth";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null, expiresInMinutes?: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setTokenState] = useState<string | null>(getToken());
    const [hasAlerted, setHasAlerted] = useState(false); // ✅ เช็คว่า alert ออกแล้วหรือยัง
    const navigate = useNavigate();

    // ฟังก์ชันอัปเดต Token ใน Context
    const setToken = (newToken: string | null, expiresInMinutes?: number) => {
        if (newToken) {
            saveToken(newToken, expiresInMinutes || 30); // เซฟ Token 30 นาที (ค่าเริ่มต้น)
        } else {
            removeToken();
        }
        setTokenState(newToken);
        setHasAlerted(false);
    };

    // ตรวจสอบ Token ทุก 10 วินาที
    useEffect(() => {
        const interval = setInterval(() => {
            setHasAlerted(true);
            const currentToken = getToken();
            if (!currentToken && !hasAlerted) {
                alert("Session expired. Please login again.");
                removeToken();
                setTokenState(null);
                navigate("/login");
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [navigate, hasAlerted]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
