import { useState, useEffect, useContext } from 'react';
import Menupage from '../menupage';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth//AuthContext'; // ✅ ดึง Context มาใช้

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

function OrderTablePage() {
    const [order, setOrder] = useState<Order[]>([]);
    const [size, setSize] = useState(0);

    const auth = useContext(AuthContext); // ✅ ใช้ Context
    const token = auth?.token;
    const userRole = auth?.userRole; // ✅ ดึง user_role จาก Context

    // ✅ เช็ค Role ว่ามีสิทธิ์จัดการคำสั่งซื้อไหม
    const canManageOrders = userRole === "admin" || userRole === "inventory manager";

    // ✅ ดึงข้อมูล Order
    const fetchOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orderdels`, {
                headers: {
                    Authorization: `Bearer ${token}` // ✅ ส่ง Token ไปด้วย
                }
            });

            if (!response.ok) throw new Error('Failed to fetch orders');

            const data = await response.json();
            setOrder(data.orderdels);
            setSize(data.orderdels?.length || 0);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // ✅ โหลด Role จาก localStorage ถ้า Context ไม่มีค่า
    useEffect(() => {
        if (!auth?.userRole) {
            const storedRole = localStorage.getItem("user_role");
            if (storedRole) auth?.setUserRole(storedRole);
        }
    }, [auth]);

    // ✅ โหลด Order ตอน Component โหลด
    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    // ✅ ฟังก์ชันลบ Order
    const handleDeleteOrder = async (orderId: number) => {
        if (!canManageOrders) {
            alert("You don't have permission to delete orders.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this order?");
        if (confirmDelete) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orderdels/${orderId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}` // ✅ ส่ง Token ยืนยันตัวตน
                    }
                });

                if (response.ok) {
                    setOrder(prevOrders => prevOrders.filter(order => order.order_id !== orderId));
                    alert("Order has been successfully deleted.");
                    fetchOrders();
                } else {
                    console.error('Error deleting order:', response.statusText);
                    alert("An error occurred while deleting the order.");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div>
            <div className="grid grid-cols-12 h-screen">
                <Menupage />
                <div className="col-span-10">
                    <div className='m-7'>
                        <div className='mb-3 flex items-center'>
                            <p className='text-2xl font-semibold'>Order</p>
                        </div>
                        <div className='flex justify-center'>
                            <div style={{ width: "95%" }}>
                                <div className="overflow-x-auto border rounded-xl border-slate-200">
                                    <table className="table table-zebra text-center">
                                        <thead>
                                            <tr className='bg-cyan-700 text-white text-base'>
                                                <th>Number</th>
                                                <th>Product image</th>
                                                <th>Product Name</th>
                                                <th>Amount</th>
                                                <th>Added</th>
                                                {canManageOrders && <th>Action</th>} {/* ✅ ซ่อนปุ่มถ้าไม่มีสิทธิ์ */}
                                            </tr>
                                        </thead>
                                        {size > 0 ? (
                                            <tbody>
                                                {order.map((item: Order, index: number) => (
                                                    <tr key={index}>
                                                        <th>{index + 1}</th>
                                                        <td>
                                                            <figure className="flex justify-center w-full h-24">
                                                                <img
                                                                    style={{ width: "70%", height: "100%" }}
                                                                    src={item.product.product_image}
                                                                    alt="Product"
                                                                    className="rounded-xl object-contain"
                                                                />
                                                            </figure>
                                                        </td>
                                                        <td>{item.product.product_name}</td>
                                                        <td>{item.product_amount}</td>
                                                        <td>{new Date(item.order_del_date).toLocaleString()}</td>
                                                        {canManageOrders && (
                                                            <td>
                                                                <button
                                                                    className='btn btn-md px-7 mr-10 bg-red-400'
                                                                    onClick={() => handleDeleteOrder(item.order_del_id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        ) : (
                                            <tbody>
                                                <tr>
                                                    <td colSpan={6}>
                                                        <p className='text-center text-2xl text-red-500'>ไม่พบคำสั่งซื้อ</p>
                                                        <Link to="/Product">
                                                            <button className='btn px-8 my-2 text-2xl btn-info drop-shadow-md'>
                                                                Go to Product
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderTablePage;
