import React, { useState, useEffect } from 'react';
import Menupage from '../menupage';
import { Link, useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import MyModal from "./modal";

function PackingPage() {
    const navigate = useNavigate();
    const [order, setOrder] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [size, setSize] = useState(0);
    const [mode, setMode] = useState("boxes"); // เก็บโหมดที่เลือก

    const [isModalOpen, setIsModalOpen] = useState(false);




    useEffect(() => {
        const fetchOrdersAndBoxes = async () => {
            try {
                const responseOrders = await fetch('http://localhost:8080/api/orderdels');
                const responseBoxes = await fetch('http://localhost:8080/api/boxes');

                if (!responseOrders.ok || !responseBoxes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const dataOrders = await responseOrders.json();
                const dataBoxes = await responseBoxes.json();

                console.log(dataBoxes.boxes);
                console.log(dataOrders.orderdels)
                setBoxes(dataBoxes.boxes);
                setOrder(dataOrders.orderdels);// เข้าถึง array orders จาก key 'orders'

                setSize(dataOrders.orderdels ? dataOrders.orderdels.length : 0);
                // เข้าถึง array boxes จาก key 'boxes'
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchOrdersAndBoxes(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด
    }, []);

    const handleModeChange = (event) => {
        setMode(event.target.value); // เปลี่ยนค่า mode ตามที่เลือก
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (data: { firstname: string; lastname: string; address: string; postal: string; phone: string; }) => {
        console.log("ข้อมูลที่ส่ง:", data);
        const newItem = {
            customer_firstname: data.firstname,
            customer_lastname: data.lastname,
            customer_address: data.address,
            customer_postal: data.postal,
            customer_phone: data.phone
            ,
        };

        try {
            const response = await fetch('http://localhost:8080/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                console.log("result is", newItem);
                alert("เพิ่ม customer เรียบร้อยแล้ว");
                handleGenerate()
                // แสดงผลลัพธ์จาก backend
            } else {
                console.error('Error generating order:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        // 
    };

    const handleGenerate = async () => {
        console.log("Mode being sent:", mode); // เพิ่มการ log เพื่อดูค่า mode
        try {
            const response = await fetch('http://localhost:8080/api/generate', {
                method: 'POST', // เปลี่ยนเป็น POST
                headers: {
                    'Content-Type': 'application/json', // ตั้งค่า header ให้เป็น JSON
                },
                body: JSON.stringify({ mode: mode }), // ส่ง mode ไปยัง backend
            });

            if (response.ok) {
                const result = await response.json();
                console.log("result is", result); // แสดงผลลัพธ์จาก backend
            } else {
                console.error('Error generating order:', response.statusText);
            }

            const customer = await fetch('http://localhost:8080/api/customers');
            const customer_data = await customer.json();
            console.log("customer id is", customer_data.customer[customer_data.customer.length - 1].customer_id)

            const history = await fetch('http://localhost:8080/api/history');
            const data = await history.json();
            console.log("historyid is", data.history[data.history.length - 1].package_id)
            navigate('/Generate', { state: { message: data.history[data.history.length - 1].package_id, cus_id: customer_data.customer[customer_data.customer.length - 1].customer_id } });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <MyModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
            <div className="grid grid-cols-12 h-screen">
                <Menupage />
                <div className="col-span-10">
                    <div className='m-7'>

                        <div className='mb-3'>
                            <label className='flex items-center text-2xl font-semibold mb-3'>
                                Size
                                <Link to="/Boxesmanage" className='ml-2 btn btn-sm'>
                                    <IoSettingsOutline style={{ scale: "1.2" }} />
                                </Link>
                            </label>
                            {boxes.length > 0 &&
                                <div className='flex gap-5 mb-2'>
                                    {boxes.map((item, index) => (
                                        <div key={item.box_id || index} className='flex items-center'>
                                            <input
                                                type="checkbox"
                                                name="radio"
                                                className="checkbox mr-1"
                                                value={item.box_name.charAt(0)}

                                            // จัดการการเปลี่ยนแปลง
                                            />
                                            <label> {item.box_name.charAt(0)} ({item.box_width}x{item.box_length}x{item.box_height}) เหลือ{item.box_amount}</label>

                                        </div>
                                    ))}
                                </div>
                            }
                            <div className='flex items-center'>
                                <input
                                    type="radio"
                                    name="radio-1"
                                    className="radio mr-1"
                                    value="boxes"
                                    checked={mode === "boxes"}
                                    onChange={handleModeChange} // จัดการการเปลี่ยนแปลง
                                />
                                <label> ประหยัดจำนวนกล่อง</label>
                                <input
                                    type="radio"
                                    name="radio-1"
                                    className="radio ml-3"
                                    value="space"
                                    checked={mode === "space"}
                                    onChange={handleModeChange} // จัดการการเปลี่ยนแปลง
                                />
                                <label className="ml-1">ประหยัดพื้นที่กล่อง</label>
                            </div>
                        </div>
                        <div className='mb-3 flex items-center'>
                            <p className='text-2xl font-semibold'>Order</p>
                        </div>
                        <div className='flex justify-center mb-5'>
                            <div style={{ width: "90%" }}>
                                <div className="overflow-x-auto border rounded-xl border-slate-200">
                                    <table className="table table-zebra text-center">
                                        <thead>
                                            <tr className='bg-cyan-700 text-white text-base'>
                                                <th>Number</th>
                                                <th>Product Name</th>
                                                <th>Width(cm.)</th>
                                                <th>Length(cm.)</th>
                                                <th>Height(cm.)</th>
                                                <th>Weight(g.)</th>
                                                <th>Amount</th>
                                                <th>Added</th>
                                            </tr>
                                        </thead>
                                        {size > 0 &&
                                            <tbody>
                                                {order.map((item, index) => (
                                                    <tr key={index}>
                                                        <th>{index + 1}</th>
                                                        <td>{item.product.product_name}</td>
                                                        <td>{item.product.product_width}</td>
                                                        <td>{item.product.product_length}</td>
                                                        <td>{item.product.product_height}</td>
                                                        <td>{item.product.product_weight}</td>
                                                        <td>{item.product_amount}</td>
                                                        <td>{new Date(item.product.product_time).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            {/* <Link to='/Generate'> */}
                            <button className='btn btn-lg bg-green-300 text-xl' onClick={handleOpenModal}>Generate</button>
                            {/* </Link> */}
                        </div>
                    </div>
                </div>
            </div>
            <MyModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
        </div>
    );
}

export default PackingPage;
