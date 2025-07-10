// src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken as saveToken, removeToken } from "./auth";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null, expiresInMinutes?: number) => void;
    userId: string | null;
    setUserId: (userId: string | null) => void;
    userRole: string | null; // ✅ เพิ่ม userRole
    setUserRole: (role: string | null) => void; // ✅ ฟังก์ชัน setUserRole
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setTokenState] = useState<string | null>(getToken());
    const [userId, setUserIdState] = useState<string | null>(localStorage.getItem("userId"));
    const [userRole, setUserRoleState] = useState<string | null>(localStorage.getItem("user_role")); // ✅ ดึง role จาก localStorage
    const [hasAlerted, setHasAlerted] = useState(false);
    const navigate = useNavigate();

    // ฟังก์ชันอัปเดต Token
    const setToken = (newToken: string | null, expiresInMinutes?: number) => {
        if (newToken) {
            saveToken(newToken, expiresInMinutes || 30);
        } else {
            removeToken();
        }
        setTokenState(newToken);
        setHasAlerted(false);
    };

    // ฟังก์ชันอัปเดต userId
    const setUserId = (newUserId: string | null) => {
        if (newUserId) {
            localStorage.setItem("userId", newUserId);
        } else {
            localStorage.removeItem("userId");
        }
        setUserIdState(newUserId);
    };

    // ✅ ฟังก์ชันอัปเดต userRole
    const setUserRole = (newRole: string | null) => {
        if (newRole) {
            localStorage.setItem("user_role", newRole);
        } else {
            localStorage.removeItem("user_role");
        }
        setUserRoleState(newRole);
    };

    // ตรวจสอบ Token ทุก 2 นาที
    useEffect(() => {
        const interval = setInterval(() => {
            const currentToken = getToken();
            if (!currentToken && !hasAlerted) {
                alert("Session expired. Please login again.");
                removeToken();
                setHasAlerted(true);
                setTokenState(null);
                setUserIdState(null);
                setUserRoleState(null); // ✅ ลบ userRole เมื่อออกจากระบบ
                navigate("/login");
            }
        }, 120000);

        return () => clearInterval(interval);
    }, [navigate, hasAlerted]);

    useEffect(() => {
        if (token) {
            setHasAlerted(false);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, userId, setUserId, userRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};
