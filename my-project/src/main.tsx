import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./components/auth/AuthContext";
import App from "./App.tsx";
import Productpage from "./components/product/productpage.tsx";
import AddProductPage from "./components/product/addproductpage.tsx";
import EditProductPage from "./components/product/editproductpage.tsx";
import Orderpage from "./components/order/orderpage.tsx";
import Packingpage from "./components/generate/packingpage.tsx";
import Historypage from "./components/history/historypage.tsx";
import Historydetailpage from "./components/history/historydetailpage.tsx";
import Generatepage from "./components/generate/generatepage.tsx";
import Boxesmanage from "./components/generate/boxesmanage.tsx";
import Productpacking from "./components/product/productpacking.tsx";
import Login from "./components/login/loginpage.tsx";
import Register from "./components/login/registerpage.tsx";
import "./index.css";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Main = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* หน้าที่ไม่ต้องใช้ ProtectedRoute */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* หน้าที่ต้องล็อกอินก่อนถึงเข้าได้ */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <Orderpage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product"
            element={
              <ProtectedRoute>
                <Productpage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addproduct"
            element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editproduct/:product_id"
            element={
              <ProtectedRoute>
                <EditProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/packing"
            element={
              <ProtectedRoute>
                <Packingpage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <Generatepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Historypage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historydetail"
            element={
              <ProtectedRoute>
                <Historydetailpage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/boxesmanage"
            element={
              <ProtectedRoute>
                <Boxesmanage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productpacking"
            element={
              <ProtectedRoute>
                <Productpacking />
              </ProtectedRoute>
            }
          />

          {/* Redirect ไปหน้า Login ถ้า URL ไม่ถูกต้อง */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
