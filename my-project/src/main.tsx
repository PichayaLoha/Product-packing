import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Productpage from './components/product/productpage.tsx';
import AddProductPage from './components/product/addproductpage.tsx';
import EditProductPage from './components/product/editproductpage.tsx';
import Orderpage from './components/order/orderpage.tsx';
import Addorder from './components/order/addorderpage.tsx';
import Editorderpage from './components/order/editorderpage.tsx';
import Packingpage from './components/generate/packingpage.tsx';
import Historypage from './components/history/historypage.tsx';
import Historydetailpage from './components/history/historydetailpage.tsx';
import Generatepage from './components/generate/generatepage.tsx';
import Boxesmanage from './components/generate/boxesmanage.tsx';
import Login from './components/login/loginpage.tsx';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
  },
  {
    path: "/Order",
    element: <Orderpage />,
  },
  {
    path: "/Addorder",
    element: <Addorder />,
  },
  {
    path: "/Editorder/:order_id",
    element: <Editorderpage />,
  },
  {
    path: "/Product",
    element: <Productpage />,
  },
  {
    path: "/Addproduct",
    element: <AddProductPage />,
  },
  {
    path: "/Editproduct/:product_id",
    element: <EditProductPage />,
  },
  {
    path: "/Packing",
    element: <Packingpage />,
  },
  {
    path: "/Generate",
    element: <Generatepage />,
  },
  {
    path: "/History",
    element: <Historypage />,
  },
  {
    path: "/Historydetail",
    element: <Historydetailpage />,
  },
  {
    path: "/Boxesmanage",
    element: <Boxesmanage />,
  },
  {
    path: "/Login",
    element: <Login />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
