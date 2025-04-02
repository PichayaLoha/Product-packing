import { createContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken as saveToken, removeToken } from "./auth";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null, expiresInMinutes?: number) => void;
    userId: number | null;  // ✅ เพิ่ม userId
    setUserId: (id: number | null) => void;  // ✅ เพิ่ม setUserId
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setTokenState] = useState<string | null>(getToken());
    const [userId, setUserIdState] = useState<number | null>(null);  // ✅ เพิ่ม state userId
    const [hasAlerted, setHasAlerted] = useState(false);
    const navigate = useNavigate();

    // ✅ ฟังก์ชันอัปเดต Token
    const setToken = (newToken: string | null, expiresInMinutes?: number) => {
        if (newToken) {
            saveToken(newToken, expiresInMinutes || 30);
        } else {
            removeToken();
        }
        setTokenState(newToken);
        setHasAlerted(false);
    };

    // ✅ ฟังก์ชันอัปเดต userId
    const setUserId = (id: number | null) => {
        setUserIdState(id);
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
                setUserIdState(null);  // ✅ ล้าง userId ด้วย
                navigate("/login");
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [navigate, hasAlerted]);

    return (
        <AuthContext.Provider value={{ token, setToken, userId, setUserId }}>
            {children}
        </AuthContext.Provider>
    );
};
