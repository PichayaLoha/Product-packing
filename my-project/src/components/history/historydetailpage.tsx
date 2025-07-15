import React, { useEffect, useState } from 'react'
import Menupage from '../menupage';
import { useLocation, useNavigate } from 'react-router-dom';
interface OrderItem {
    package_del_id: number;
    package_del_boxsize: string;
    package_id: {
        package_box_id: number;
        product_name: string;
        product_height: number;
        product_length: number;
        product_width: number;
        product_weight: number;
        package_box_x: number;
        package_box_y: number;
        package_box_z: number;
        product_image: string;
    }[];
}

function Historydetailpage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { message, f_name, l_name } = location.state || {};

    const [order, setOrder] = useState<OrderItem[]>([]);
    const [check, setCheck] = useState();

    const [create_firstname, setCreateFirstname] = useState(0);
    const [create_lastname, setCreateLastname] = useState(0);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log("message", message, f_name, l_name);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${message}`);
                const data = await response.json();
                console.log("test", data);

                setCreateFirstname(data.user_first_name);
                setCreateLastname(data.user_last_name);

                setCheck(data.package_status);
                setOrder(data.history_dels || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchOrders();
    }, []);

    const updateStatus = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${message}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ package_status: "Packed" }),
            });
            if (response.ok) {
                alert("Update status success");
                navigate('/history');
            } else {
                console.error('Error updating status:', response.statusText);
            }
        }
        catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    const handleRowClick = (packageDelId: number) => {
        console.log("📦 ส่งค่า package_dels_id:", packageDelId); // ✅ Debug ตรวจสอบค่าที่ถูกส่งไป
        navigate('/productpacking', { state: { package_dels_id: packageDelId, message: message, cus_firstname: f_name, cus_lastname: l_name } });
    };

    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10 m-5">
                <div className='flex mb-5 items-end'>
                    <p className='text-3xl mr-5'>History</p>
                    {check === "Unpacked" && (
                        <button className='btn btn-soft btn-success' onClick={updateStatus}>
                            Packed
                        </button>
                    )}
                </div>
                <div className='flex mb-5 items-end'>
                    <p className='text-xl mr-5'>Created by : {create_firstname} {create_lastname}</p>

                </div>
                <div className='flex justify-center'>
                    <div style={{ width: "90%" }}>
                        <div className="overflow-x-auto border rounded-xl border-slate-200">
                            <table className="table table-zebra text-center">
                                <thead>
                                    <tr className='bg-cyan-700 text-white text-base'>
                                        <th>No.</th>
                                        <th>Box size</th>
                                        <th>Items per box</th>
                                        <th>Customer name</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.map((item, index) => (
                                        <React.Fragment key={item.package_del_id}>
                                            <tr className='bg-stone-400 cursor-pointer'>
                                                <th>{index + 1}</th>
                                                <td>{item.package_del_boxsize}</td>
                                                <td>{item.package_id.length}</td>
                                                <td>{f_name} {l_name}</td>
                                                <td><button className='btn btn-sm' onClick={() => handleRowClick(item.package_del_id)}>Preview</button></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={5} className='bg-stone-500'>
                                                    <div className="p-5 overflow-x-auto bg-white">
                                                        <table className="table  text-center">
                                                            <thead>
                                                                <tr>
                                                                    <th>Number</th>
                                                                    <th>Product Name</th>
                                                                    <th>Product Image</th>
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
                                                                        <td><figure className="flex justify-center w-full h-24 ">
                                                                            <img style={{ width: "70%", height: "100%" }}
                                                                                src={product.product_image}
                                                                                alt="Shoes"
                                                                                className="rounded-xl object-contain" />
                                                                        </figure></td>
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
