import React, { useState, useEffect } from 'react';
import Menupage from '../menupage';

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
    // ดึงข้อมูล orders จาก backend เมื่อ component โหลดconst 
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/orderdels');
            const data = await response.json();
            console.log(size)
            console.log(data.orderdels)
            setOrder(data.orderdels);
            setSize(data.orderdels ? data.orderdels.length : 0) // เข้าถึง array orders จาก key 'Products'
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        // prevOrders
    };
    useEffect(() => {
        fetchOrders(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด
    }, []); // [] ทำให้ useEffect ทำงานเพียงครั้งเดียวเมื่อ component โหลด

    const handleDeleteOrder = async (orderId: number) => {
        const confirmDelete = window.confirm("คุณแน่ใจหรือว่าต้องการลบออเดอร์นี้?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/orderdels/${orderId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setOrder(prevOrders => prevOrders.filter(order => order.order_id !== orderId));
                    alert("ลบออเดอร์เรียบร้อยแล้ว");
                    fetchOrders();
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
                        </div>
                        <div className='flex justify-center'>
                            <div style={{ width: "95%" }}>
                                <div className="overflow-x-auto border rounded-xl border-slate-200">
                                    <table className="table table-zebra text-center">
                                        <thead>
                                            <tr className='bg-cyan-700 text-white text-base'>
                                                <th>Number</th>
                                                <th>image</th>
                                                <th>Product Name</th>
                                                <th>Amount</th>
                                                <th>Added</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        {size > 0 &&
                                            <tbody>
                                                {order.map((item: Order, index: number) => (
                                                    <tr key={index}>
                                                        <th>{index + 1}</th>
                                                        <td><figure className="flex justify-center w-full h-24 ">
                                                            <img style={{ width: "70%", height: "100%" }}
                                                                src={item.product.product_image}
                                                                alt="Shoes"
                                                                className="rounded-xl object-contain" />
                                                        </figure>
                                                        </td>
                                                        <td>{item.product.product_name}</td>
                                                        <td>{item.product_amount}</td>
                                                        <td>{new Date(item.order_del_date).toLocaleString()}</td>
                                                        <td>
                                                            <button
                                                                className='btn btn-md px-7 mr-10 bg-red-400'
                                                                onClick={() => handleDeleteOrder(item.order_del_id)}
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
