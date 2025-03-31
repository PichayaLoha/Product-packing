import React, { useState, useEffect } from 'react';
import Menupage from '../menupage';
import { Link, useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import MyModal from "./modal";

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

    const fetchOrdersAndBoxes = async () => {
        try {
            const [responseOrders, responseBoxes] = await Promise.all([
                fetch('http://localhost:8080/api/orderdels'),
                fetch('http://localhost:8080/api/boxes')
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

    // sort boxes by volume (width * length * height)
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
        console.log("Mode being sent:", mode, "Blocked boxes:", blockedBoxes);

        try {
            const response = await fetch('http://localhost:8080/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode, blocked_boxes: blockedBoxes }) // ✅ เปลี่ยนเป็น "blocked_boxes"
            });

            if (response.ok) {
                const result = await response.json();
                console.log("result is", result);
            } else {
                console.error('Error generating order:', response.statusText);
            }

            const [customerRes, historyRes] = await Promise.all([
                fetch('http://localhost:8080/api/customers'),
                fetch('http://localhost:8080/api/history')
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
                                Size
                                <Link to="/Boxesmanage" className='ml-2 btn btn-sm'>
                                    <IoSettingsOutline style={{ scale: "1.2" }} />
                                </Link>
                            </label>
                            {boxes.length > 0 &&
                                <div className='flex gap-5 mb-2'>
                                    {sortedBoxes.map((item, index) => (
                                        <div key={item.box_id || index} className='flex items-center'>
                                            <input
                                                type="checkbox"
                                                className="checkbox mr-1"
                                                value={item.box_id}
                                                checked={!blockedBoxes.includes(item.box_id)}
                                                onChange={() => handleBoxChange(item.box_id)}
                                            />
                                            <label> {item.box_name} ({item.box_width}x{item.box_length}x{item.box_height}) เหลือ {item.box_amount} </label>
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
                        {size > 0 && (
                            <div className='flex justify-center'>
                                {/* <Link to='/Generate'> */}
                                <button className='btn btn-lg bg-green-300 text-xl' onClick={handleOpenModal}>Generate</button>
                                {/* </Link> */}
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
