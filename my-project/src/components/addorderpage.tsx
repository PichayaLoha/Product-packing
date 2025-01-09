import React, { useState } from 'react';
import Menupage from './menupage';
import { useNavigate, Link } from 'react-router-dom'; // เพิ่ม Link ที่นี่

function AddOrderPage() {
    const navigate = useNavigate();
    const [product_name, setproduct_name] = useState("");
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [amount, setAmount] = useState("");
    const [userId, setuserId] = useState("");
    
    const handleAddItem = async () => {
        const newItem = {
            product_name,
            product_width: parseFloat(width),
            product_length: parseFloat(length),
            product_height: parseFloat(height),
            product_weight: parseFloat(weight),
            product_amount: parseInt(amount),
            product_userid: parseInt(userId)
        };

        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            console.log(newItem)
            if (response.ok) {
                // นำทางไปยังหน้าผลลัพธ์
                navigate('/Product');
            } else {
                console.error('Error adding item:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10">
                <div className='flex justify-center items-center h-screen'>
                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body">
                            <div className="card-title grid justify-center"><h2 >เพิ่มสินค้า</h2></div>

                            <div className='grid grid-cols-2 gap-4'>
                                <label className="form-control w-full max-w-xs col-span-2">
                                    <span className="label-text">ชื่อสินค้า</span>
                                    <input
                                        type="text"
                                        placeholder="ชื่อสินค้า"
                                        value={product_name}
                                        onChange={(e) => setproduct_name(e.target.value)} // อัปเดต state
                                        className="input input-bordered input-sm w-full max-w-xs" />
                                </label>

                                <label className="form-control w-full max-w-xs">
                                    <span className="label-text">ความกว้าง</span>
                                    <input
                                        type="text"
                                        placeholder="เซนติเมตร"
                                        value={width}
                                        onChange={(e) => setWidth(e.target.value)} // อัปเดต state
                                        className="input input-bordered input-sm w-full max-w-xs" />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <span className="label-text">ความยาว</span>
                                    <input
                                        type="text"
                                        placeholder="เซนติเมตร"
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)} // อัปเดต state
                                        className="input input-bordered input-sm w-full max-w-xs" />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <span className="label-text">ความสูง</span>
                                    <input
                                        type="text"
                                        placeholder="เซนติเมตร"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)} // อัปเดต state
                                        className="input input-bordered input-sm w-full max-w-xs" />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <span className="label-text">น้ำหนัก</span>
                                    <input
                                        type="text"
                                        placeholder="น้ำหนัก"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)} // อัปเดต state
                                        className="input input-bordered input-sm w-full max-w-xs" />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <span className="label-text">จำนวน</span>
                                    <input
                                        type="text"
                                        placeholder="จำนวน"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)} // อัปเดต state
                                        className="input input-bordered input-sm w-full max-w-xs" />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <span className="label-text">ผู้ใช้</span>
                                    <input
                                        type="text"
                                        placeholder="userid"
                                        value={userId}
                                        onChange={(e) => setuserId(e.target.value)} // อัปเดต state
                                        className="input input-bordered input-sm w-full max-w-xs" />
                                </label>
                            </div>
                            <div className="card-actions justify-center">
                                <button className="btn bg-green-500 btn-sm" onClick={handleAddItem}>Add</button>
                                <Link to='/Product'>
                                    <button className="btn btn-error btn-sm">Cancel</button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AddOrderPage;
