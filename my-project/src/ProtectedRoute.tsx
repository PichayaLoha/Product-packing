// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//   const token = localStorage.getItem("token");
//   return token ? <Outlet /> : <Navigate to="/Login" replace />;
// };

// export default ProtectedRoute;
// src/components/ProtectedRoute.js
// src/components/ProtectedRoute.tsx
import { useContext } from "react";
import { AuthContext } from "./components/auth/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

