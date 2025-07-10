import React, { useState, useEffect, useContext } from 'react';
import Menupage from '../menupage';
import { Link, useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import MyModal from "./modal";
import { AuthContext } from '../auth/AuthContext';

interface Order {
    product: {
        product_id: number;
        product_name: string;
        product_weight: number;
        product_width: number;
        product_length: number;
        product_height: number;
        product_image: string;
        product_time: string;
    };
    product_amount: number;
    product_id: number;
    order_id: number;
    order_del_id: number;
}

interface Box {
    box_id: number;
    box_name: string;
    box_width: string;
    box_length: string;
    box_height: string;
    box_maxweight: string;
    box_amount: string;
}

function PackingPage() {

    const navigate = useNavigate();
    const [order, setOrder] = useState<Order[]>([]);
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [size, setSize] = useState(0);
    const [mode, setMode] = useState("boxes"); // เก็บโหมดที่เลือก

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState<string>(""); // สถานะสำหรับ userId

    const auth = useContext(AuthContext);
    const userRole = auth?.userRole || localStorage.getItem("user_role");
    const canEditOrDelete = userRole === "admin" || userRole === "packer";

    const fetchOrdersAndBoxes = async () => {
        const userId = localStorage.getItem("userId");
        setUserId(userId || "");
        try {
            const [responseOrders, responseBoxes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/orderdels`),
                fetch(`${import.meta.env.VITE_API_URL}/api/boxes`)
            ]);

            if (!responseOrders.ok || !responseBoxes.ok) throw new Error('Failed to fetch data');

            const [dataOrders, dataBoxes] = await Promise.all([
                responseOrders.json(),
                responseBoxes.json()
            ]);

            console.log("Box", dataBoxes.boxes)
            console.log("Order", dataOrders.orderdels)

            setBoxes(dataBoxes.boxes);
            setOrder(dataOrders.orderdels);
            setSize(dataOrders.orderdels?.length || 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchOrdersAndBoxes(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล
    }, []);

    useEffect(() => {
        if (boxes.length > 0) { // ✅ เช็คว่า boxes มีค่าแล้ว และยังไม่เคยเซ็ตค่า
            setBlockedBoxes(
                boxes
                    .filter(box => !box.box_amount) // ✅ เอาเฉพาะอันที่ไม่มี amount (box_amount = 0 หรือ undefined)
                    .map(box => box.box_id) // ✅ ดึงเฉพาะ box_id ที่ต้องการให้ติ๊ก
            );
        }
    }, [boxes]);

    const [blockedBoxes, setBlockedBoxes] = useState<number[]>([]);

    const handleBoxChange = (boxId: number) => {
        setBlockedBoxes(prev =>
            prev.includes(boxId)
                ? prev.filter(id => id !== boxId)
                : [...prev, boxId]
        );
        console.log("blockedBoxes", blockedBoxes);
    };

    const sortedBoxes = [...boxes].sort((a, b) =>
        parseFloat(a.box_width) * parseFloat(a.box_length) * parseFloat(a.box_height) -
        parseFloat(b.box_width) * parseFloat(b.box_length) * parseFloat(b.box_height)
    );


    const handleModeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
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
            customer_phone: data.phone,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                console.log("userid is", userId)
                console.log("result is", newItem);
                alert("Add customer success");
                handleCloseModal(); // ปิด modal หลังจากส่งข้อมูล
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
        console.log("Mode being sent:", mode, "Blocked boxes:", blockedBoxes);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode, blocked_boxes: blockedBoxes, user_id: parseInt(userId) })
            });

            if (response.ok) {
                const result = await response.json();
                console.log("result is", result);
            } else {
                console.error('Error generating order:', response.statusText);
            }

            const [customerRes, historyRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/customers`),
                fetch(`${import.meta.env.VITE_API_URL}/api/history`)
            ]);

            const [customerData, historyData] = await Promise.all([
                customerRes.json(),
                historyRes.json()
            ]);

            const lastCustomerId = customerData.customer.at(-1)?.customer_id;
            const lastHistoryId = historyData.history.at(-1)?.package_id;

            navigate('/Generate', { state: { message: lastHistoryId, cus_id: lastCustomerId } });

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
                                Box size
                                {canEditOrDelete ? (
                                    <Link to="/Boxesmanage" className='ml-2 btn btn-sm'>
                                        <IoSettingsOutline style={{ scale: "1.2" }} />
                                    </Link>
                                ) : (
                                    // <Link  className='ml-2 btn btn-sm'>
                                    <IoSettingsOutline style={{ scale: "1.2" }} />
                                    // </Link>
                                )
                                }


                            </label>
                            {canEditOrDelete ? (
                                boxes.length > 0 ? (
                                    <div className="overflow-x-auto pb-2">
                                        <div className="flex flex-row flex-nowrap gap-4 min-w-max">
                                            {sortedBoxes.map((item, index) => (
                                                <div
                                                    key={item.box_id || index}
                                                    className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox mr-2"
                                                        value={item.box_id}
                                                        checked={!blockedBoxes.includes(item.box_id)}
                                                        onChange={() => handleBoxChange(item.box_id)}
                                                    />
                                                    <div>
                                                        <span className="font-medium">{item.box_name}</span>
                                                        <span className="ml-1">[{item.box_width}x{item.box_length}x{item.box_height}]</span>
                                                        <span className="ml-1 text-gray-600">Left: {item.box_amount}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className='text-center text-2xl text-red-500'>ไม่พบกล่องที่เตรียมคำนวณ</p>
                                )
                            ) : (
                                <p className='text-left text-xl text-red-500'>ไม่สามารถแก้ไขได้</p>
                            )}
                            <p className='text-2xl font-semibold mb-2'>Mode</p>
                            {canEditOrDelete ? (
                                <div className='flex items-center'>
                                    <input
                                        type="radio"
                                        name="radio-1"
                                        className="radio mr-1"
                                        value="boxes"
                                        checked={mode === "boxes"}
                                        onChange={handleModeChange} // จัดการการเปลี่ยนแปลง
                                    />
                                    <label> Minimize the number of boxes</label>
                                    <input
                                        type="radio"
                                        name="radio-1"
                                        className="radio ml-3"
                                        value="space"
                                        checked={mode === "space"}
                                        onChange={handleModeChange} // จัดการการเปลี่ยนแปลง
                                    />
                                    <label className="ml-1">Optimize box space</label>
                                </div>) : (
                                <p className='text-left text-xl text-red-500'>ไม่สามารถแก้ไขได้</p>
                            )}
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
                                                <th>Product Image</th>
                                                <th>Product Name</th>
                                                <th>Weight(kg.)</th>
                                                <th>Amount</th>
                                                <th>Width(cm.)</th>
                                                <th>Length(cm.)</th>
                                                <th>Height(cm.)</th>

                                                <th>Added</th>
                                            </tr>
                                        </thead>
                                        {size > 0 ? (
                                            <tbody>
                                                {order.map((item: Order, index) => (
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
                                                        <td>{item.product.product_weight}</td>
                                                        <td>{item.product_amount}</td>
                                                        <td>{item.product.product_width}</td>
                                                        <td>{item.product.product_length}</td>
                                                        <td>{item.product.product_height}</td>

                                                        <td>{new Date(item.product.product_time).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        ) : (
                                            <tbody>
                                                <tr className=''>
                                                    <td colSpan={9} >
                                                        <p className='text-center text-2xl text-red-500'>ไม่พบสินค้าที่เตรียมคำนวณ</p>
                                                        <Link to="/Product">
                                                            <button className='btn px-8 my-2 text-2xl btn-info drop-shadow-md'>Go to Product</button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                            </div>
                        </div>

                        {size > 0 && canEditOrDelete ? (
                            <div className='flex justify-center'>
                                {/* <Link to='/Generate'> */}
                                <button className='btn btn-lg bg-green-300 text-xl' onClick={handleOpenModal}>Generate</button>
                                {/* </Link> */}
                            </div>
                        ) : (
                            <div className='flex justify-center'>
                                <button className='btn btn-lg bg-green-300 text-xl' onClick={handleOpenModal} disabled>Generate</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <MyModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
        </div>
    );
}

export default PackingPage;
