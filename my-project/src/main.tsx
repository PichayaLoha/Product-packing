import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Productpage from './components/productpage';
import Addorder from './components/addorderpage';
import Editorderpage from './components/editorderpage.tsx';
import Packingpage from './components/packingpage.tsx';
import Historypage from './components/historypage.tsx';
import Historydetailpage from './components/historydetailpage.tsx';
import Generatepage from './components/generatepage.tsx';
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
    path: "/Product",
    element: <Productpage />,
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
    path: "/Packing",
    element: <Packingpage/>,
  },
  {
    path: "/Generate",
    element: <Generatepage />,
  },
  {
    path: "/History",
    element: <Historypage/>,
  },
  {
    path: "/Historydetail",
    element: <Historydetailpage />,
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
