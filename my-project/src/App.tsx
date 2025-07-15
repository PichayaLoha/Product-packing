import { useState, useEffect } from 'react';
import Menupage from './components/menupage';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import { Link } from 'react-router-dom';


interface Product {
  product_image: string;
  product_name: string;
}
interface Order {
  order_del_id: number;
  product: Product;
  product_amount: number;
  order_del_date: string;
  order_id: number;
}
interface History {
  package_id: number;
  package_amount: number;
  customer_firstname: string;
  customer_lastname: string;
  package_status: string;
  history_id: number;
}


function OrderTablePage() {
  const [order, setOrder] = useState<Order[]>([]);
  const [size, setSize] = useState<number>(0);
  const [hissize, setHissize] = useState<number>(0);
  const [history, setHistory] = useState<History[]>([]);

  // ดึงข้อมูล orders จาก backend เมื่อ component โหลด
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    const fetchOrderDels = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orderdels`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setOrder(data.orderdels);
            setSize(data.orderdels ? data.orderdels.length : 0);

        } catch (error) {
            console.error("Error fetching order dels:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const responseOrders = await fetch(`${import.meta.env.VITE_API_URL}/api/history`);
            if (!responseOrders.ok) {
                throw new Error(`HTTP error! status: ${responseOrders.status}`);
            }
           const dataOrders = await responseOrders.json();

        console.log("history :", dataOrders.history);

        setHistory(dataOrders.history);
        setHissize(dataOrders.history ? dataOrders.history.length : 0);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    fetchOrderDels();
    fetchOrders(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด

  }, []);

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
                            <td>{new Date(item.order_del_date).toLocaleString()}</td>
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
                        <th>No.</th>
                        <th>Box amount</th>
                        <th>Customer name</th>
                        <th>Status</th>
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
