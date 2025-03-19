import React, { useState } from 'react';
import Menupage from '../menupage';
import { useNavigate, Link } from 'react-router-dom'; // เพิ่ม Link ที่นี่
interface ImageChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
}

function AddProductPage() {
    const navigate = useNavigate();
    const [product_name, setproduct_name] = useState("");
    const [width, setWidth] = useState("");
    const [length, setLength] = useState<string>("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [amount, setAmount] = useState("");
    const [cost, setCost] = useState("");
    const [userId, setuserId] = useState("");

    const [image, setImage] = useState<File | null>();
    const [preview, setPreview] = useState<string | null>();



    const handleImageChange = (e: ImageChangeEvent) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAddItem = async () => {
        const formData = new FormData();
        formData.append("product_name", product_name);
        formData.append("product_height", height);
        formData.append("product_length", length);
        formData.append("product_width", width);
        formData.append("product_weight", weight);
        formData.append("product_amount", amount);
        formData.append("product_cost", cost);
        formData.append("user_id", userId);

        if (image) {
            formData.append("product_image", image); // 📌 เพิ่มรูปภาพ
        } else {
            alert("โปรดใส่รูปก่อน");
        }

        try {
            const response = await fetch("http://localhost:8080/api/products", {
                method: "POST",
                body: formData, // 📌 เปลี่ยนจาก JSON เป็น FormData
            });

            if (response.ok) {
                navigate("/Product");
            } else {
                console.error("Error adding item:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
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
                                        onChange={(e) => {
                                            setproduct_name(e.target.value)
                                        }
                                        } // อัปเดต state
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
                                    <span className="label-text">ราคา</span>
                                    <input
                                        type="text"
                                        placeholder="บาท"
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)} // อัปเดต state
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
                                <label className="form-control w-full max-w-xs">
                                    <input className="file-input file-input-bordered file-input-info file-input-xs w-full max-w-xs " type="file" onChange={handleImageChange} accept="image/*" name="fileToUpload" />
                                </label>
                                <div className="flex justify-center col-span-2 max-w-xs prevent-select h-40 w-full object-cover">
                                    {preview && (
                                        <img src={preview} alt="Preview" />
                                    )}
                                </div>
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

export default AddProductPage;
