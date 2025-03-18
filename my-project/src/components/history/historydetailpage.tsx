import React, { useEffect, useState } from 'react'
import Menupage from '../menupage';
import { useLocation, useNavigate } from 'react-router-dom';

function Historydetailpage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { message } = location.state;
    const [order, setOrder] = useState([]);
    const [check, setCheck] = useState();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log("message", message);
                const response = await fetch(`http://localhost:8080/api/history/${message}`);
                const data = await response.json();
                console.log("test", data);
                setCheck(data.package_status);
                setOrder(data.history_dels || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchOrders();
    }, []); 

    const handleRowClick = (packageDelId: number) => {
        console.log("📦 ส่งค่า package_dels_id:", packageDelId); // ✅ Debug ตรวจสอบค่าที่ถูกส่งไป
        navigate('/productpacking', { state: { package_dels_id: packageDelId, message:  message} });
    };

    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10 m-5">
                <div className='flex mb-5 items-end'>
                    <p className='text-3xl mr-5'>History</p>
                    {check === "Unpacked" && (
                        <button className='btn btn-sm btn-success' onClick={() => alert("Update Status")}>
                            Packed
                        </button>
                    )}
                </div>
                <div className='flex justify-center'>
                    <div style={{ width: "90%" }}>
                        <div className="overflow-x-auto border rounded-xl border-slate-200">
                            <table className="table table-zebra text-center">
                                <thead>
                                    <tr className='bg-cyan-700 text-white text-base'>
                                        <th>ลำดับ</th>
                                        <th>ขนาดกล่อง</th>
                                        <th>user-id</th>
                                        <th>ชื่อ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.map((item, index) => (
                                        <React.Fragment key={item.package_del_id}>
                                            <tr className='bg-stone-400 cursor-pointer' 
                                                onClick={() => handleRowClick(item.package_del_id)}>
                                                <th>{index + 1}</th>
                                                <td>{item.package_del_boxsize}</td>
                                                <td>{item.package_del_id}</td>
                                                <td>Bob</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} className='bg-stone-500'>
                                                    <div className="p-5 overflow-x-auto bg-white">
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Number</th>
                                                                    <th>Product Name</th>
                                                                    <th>Hight</th>
                                                                    <th>Lenght</th>
                                                                    <th>Widght</th>
                                                                    <th>Weight</th>
                                                                    <th>X</th>
                                                                    <th>Y</th>
                                                                    <th>Z</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {item.package_id.map((product, productIndex) => (
                                                                    <tr key={product.package_box_id}>
                                                                        <th>{productIndex + 1}</th>
                                                                        <td>{product.product_name}</td>
                                                                        <td>{product.product_height}</td>
                                                                        <td>{product.product_length}</td>
                                                                        <td>{product.product_width}</td>
                                                                        <td>{product.product_weight}</td>
                                                                        <td>{product.package_box_x}</td>
                                                                        <td>{product.package_box_y}</td>
                                                                        <td>{product.package_box_z}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Historydetailpage;
