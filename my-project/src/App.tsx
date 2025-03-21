import React, { useState, useEffect } from 'react';
import Menupage from './components/menupage';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import { Link } from 'react-router-dom';

function OrderTablePage() {
  const [order, setOrder] = useState([]);
  const [size, setSize] = useState(0);
  const [hissize, setHissize] = useState(0);
  const [history, setHistory] = useState([]);

  // ดึงข้อมูล orders จาก backend เมื่อ component โหลด
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/orderdels');
        const data = await response.json();
        console.log(data.orderdels); // log ข้อมูลทั้งหมดที่ได้รับ
        setOrder(data.orderdels); // เข้าถึง array orders จาก key 'orders'
        setSize(data.orderdels ? data.orderdels.length : 0);

        const responseOrders = await fetch('http://localhost:8080/api/history');
        const dataOrders = await responseOrders.json();

        console.log("history :", dataOrders.history);

        setHistory(dataOrders.history);
        setHissize(dataOrders.history ? dataOrders.history.length : 0);

      } catch (error) {
        console.error('Error fetching orders:', error);
      }

    };
    fetchOrders(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด

  }, []); // [] ทำให้ useEffect ทำงานเพียงครั้งเดียวเมื่อ component โหลด

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-12 h-screen">
        <Menupage />
        <div className="col-span-5">
          <div className='m-7'>
            <div className='mb-3 flex items-center'>
              <Link to={"/Order"}>
                <p className='text-2xl font-semibold hover:underline hover:decoration-cyan-700'>Order</p>
              </Link>
            </div>
            <div className='flex '>
              <div style={{}}>
                <div className="overflow-x-auto border rounded-2xl shadow-md border-slate-200">
                  <table className="table table-zebra text-center">
                    <thead>
                      <tr className='bg-cyan-700 text-white xl:text-base lg:text-xs '>
                        <th className='w-14'>Number</th>
                        <th>Product Name</th>
                        <th>Amount</th>
                        <th>Added</th>
                      </tr>
                    </thead>
                    {size > 0 &&
                      <tbody>
                        {order.map((item, index) => (
                          <tr key={index} className='text-xs sm:text-xs 2xl:text-sm '>
                            <th>{index + 1}</th>
                            <td>{item.product.product_name}</td>
                            <td>{item.product_amount}</td>
                            <td>{item.order_del_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    }
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-5">
          <div className='m-7'>
            <div className='mb-3 flex items-center'>
              <Link to="/History">
                <b className='text-2xl font-semibold hover:underline hover:decoration-cyan-700'>History</b>
              </Link>
            </div>
            <div className='flex justify-center'>
              <div style={{ width: "90%" }}>
                <div className="overflow-x-auto border rounded-2xl shadow-md border-slate-200">
                  <table className="table bg-stone-500  text-center">
                    <thead>
                      <tr className='bg-cyan-700 text-white text-xs sm:text-xs 2xl:text-sm'>
                        <th>ลำดับ</th>
                        <th>จำนวนกล่อง</th>
                        <th>ชื่อ</th>
                        <th>status</th>
                      </tr>
                    </thead>
                    {hissize > 0 &&
                      <tbody className='text-white text-base'>
                        {history.map((item, index) => (
                          <tr key={index} className='text-xs sm:text-xs 2xl:text-sm '>
                            <th>{index + 1}</th>
                            <td>{item.package_amount}</td>
                            {/* <Link></Link> */}
                            <td>{item.customer_firstname} {item.customer_lastname}</td>
                            <td>{item.package_status}</td>
                          </tr>
                        ))}
                      </tbody>
                    }
                  </table>
                </div>
              </div>
            </div>
            {/* <div className='flex '>
            <div style={{}}>
              <div className="overflow-x-auto border rounded-xl border-slate-200">
                <table className="table table-zebra text-center ">
                  <thead>
                    <tr className='bg-cyan-700 text-white text-base md:text-xs'>
                      <th className='w-14'>Number</th>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Amount</th>
                      <th>Added</th>
                    </tr>
                  </thead>
                  {size > 0 &&
                    <tbody>
                      {product.map((item, index) => (
                        <tr key={index}>
                          <th>{index + 1}</th>
                          <td className='flex justify-center'>
                            <img src="https://cdn.discordapp.com/attachments/1100135488007966861/1135827214911426651/IMG_20230213_221222_847.jpg?ex=66d214c6&is=66d0c346&hm=dbf0cc1c87dcafdce18656e6ba18b8baf8677849f7eff2569c504a69e3450825&" alt="" className='w-20' />
                          </td>
                          <td>{item.product_name}</td>
                          <td>{item.product_amount}</td>
                          <td>{item.product_time}</td>
                        </tr>
                      ))}
                    </tbody>
                  }
                </table>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <div>
      <OrderTablePage />
    </div>
  );
}

export default App;
