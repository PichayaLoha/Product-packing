import React, { useState, useEffect } from 'react';
import Menupage from '../menupage';
import { Link } from 'react-router-dom';

function OrderTablePage() {
    const [order, setOrder] = useState([]);
    const [size, setSize] = useState(0);
    // ดึงข้อมูล orders จาก backend เมื่อ component โหลด
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/orderdels');
                const data = await response.json();
                console.log(size)
                console.log(data.orderdels)
                setOrder(data.orderdels);
                setSize(data.orderdels ?data.orderdels.length : 0) // เข้าถึง array orders จาก key 'Products'
            } catch (error) {
                console.error('Error fetching products:', error);
            }
            // prevOrders
        };

        fetchOrders(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด
    }, []); // [] ทำให้ useEffect ทำงานเพียงครั้งเดียวเมื่อ component โหลด

    const handleDeleteOrder = async (orderId) => {
        const confirmDelete = window.confirm("คุณแน่ใจหรือว่าต้องการลบออเดอร์นี้?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${orderId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setOrder(prevOrders => prevOrders.filter(order => order.order_id !== orderId));
                    alert("ลบออเดอร์เรียบร้อยแล้ว");
                } else {
                    console.error('Error deleting product:', response.statusText);
                    alert("เกิดข้อผิดพลาดในการลบสินค้า");
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
                    <div className='m-7 '>
                        <div className='mb-3 flex items-center'>
                            <p className='text-2xl font-semibold'>Order</p>
                            <Link to="/Addorder">
                                <button className='btn bg-sky-900 ml-5 text-lg text-white'>Add Order</button>
                            </Link>
                        </div>
                        <div className='flex justify-center'>
                            <div style={{ width: "95%" }}>
                                <div className="overflow-x-auto border rounded-xl border-slate-200">
                                    <table className="table table-zebra text-center">
                                        <thead>
                                            <tr className='bg-cyan-700 text-white text-base'>
                                                <th>Number</th>
                                                <th>Product Name</th>
                                                <th>Amount</th>
                                                <th>Added</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        {size > 0 &&
                                            <tbody>
                                                {order.map((item, index) => (
                                                    <tr key={index}>
                                                        <th>{index + 1}</th>
                                                        <td>{item.product.product_name}</td>
                                                        <td>{item.product_amount}</td>
                                                        <td>{new Date(item.product_time).toLocaleString()}</td>
                                                        <td>
                                                            <Link to={`/Editorder/${item.product_id}`}>
                                                                <button className='btn btn-md bg-orange-300'>แก้ไข</button>
                                                            </Link>
                                                            <button
                                                                className='btn btn-md ml-5 bg-red-400'
                                                                onClick={() => handleDeleteOrder(item.product_id)}
                                                            >
                                                                ลบ
                                                            </button>
                                                        </td>
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
        </div>
    );
}

export default OrderTablePage;
