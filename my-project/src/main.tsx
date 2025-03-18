import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Productpage from "./components/product/productpage.tsx";
import AddProductPage from "./components/product/addproductpage.tsx";
import EditProductPage from "./components/product/editproductpage.tsx";
import Orderpage from "./components/order/orderpage.tsx";
import Addorder from "./components/order/addorderpage.tsx";
import Editorderpage from "./components/order/editorderpage.tsx";
import Packingpage from "./components/generate/packingpage.tsx";
import Historypage from "./components/history/historypage.tsx";
import Historydetailpage from "./components/history/historydetailpage.tsx";
import Generatepage from "./components/generate/generatepage.tsx";
import Boxesmanage from "./components/generate/boxesmanage.tsx";
import Login from "./components/login/loginpage.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Productpacking from './components/product/productpacking.tsx';
import "./index.css";

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้า Login */}
        <Route path="/Login" element={<Login />} />

        {/* Protected Routes สำหรับหน้าที่ต้อง Login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<App />} />
          <Route path="/Order" element={<Orderpage />} />
          <Route path="/Addorder" element={<Addorder />} />
          <Route path="/Editorder/:order_id" element={<Editorderpage />} />
          <Route path="/Product" element={<Productpage />} />
          <Route path="/Addproduct" element={<AddProductPage />} />
          <Route path="/Editproduct/:product_id" element={<EditProductPage />} />
          <Route path="/Packing" element={<Packingpage />} />
          <Route path="/Generate" element={<Generatepage />} />
          <Route path="/History" element={<Historypage />} />
          <Route path="/Historydetail" element={<Historydetailpage />} />
          <Route path="/Boxesmanage" element={<Boxesmanage />} />
          <Route path="/Productpacking" element={<Productpacking />} />
        </Route>

        {/* Redirect ไปหน้า Login ถ้า URL ไม่ถูกต้อง */}
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
