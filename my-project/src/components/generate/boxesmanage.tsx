import React, { useEffect, useState } from 'react'
import Menupage from '../menupage'
import { Link, useNavigate } from 'react-router-dom';
import { tr } from 'framer-motion/client';

interface Box {
    box_id: number;
    box_name: string;
    box_width: number;
    box_length: number;
    box_height: number;
    box_maxweight: number;
    box_amount: number;
}

function Boxesmanage() {
    const navigate = useNavigate();
    const [boxes, setBoxes] = useState<Box[]>([]);
    // const [boxlong, setBoxlong] = useState([]);
    const [size, setSize] = useState(0);

    const [box_name, setBoxname] = useState("");
    const [box_width, setBoxwidth] = useState("");
    const [box_length, setBoxlength] = useState("");
    const [box_height, setheBoxheight] = useState("");
    const [box_maxweight, setBoxmaxweight] = useState("");
    const [box_amount, setBoxamount] = useState("");
    const [box_id, setBoxid] = useState("");

    const [isDisabled, setIsDisabled] = useState(true);

    const [box_name_ed, setBoxname_ed] = useState("");
    const [box_width_ed, setBoxwidth_ed] = useState("");
    const [box_length_ed, setBoxlength_ed] = useState("");
    const [box_height_ed, setheBoxheight_ed] = useState("");
    const [box_maxweight_ed, setBoxmaxweight_ed] = useState("");
    const [box_amount_ed, setBoxamount_ed] = useState("");
    const [box_id_ed, setBoxid_ed] = useState("");

    const fetchOrdersAndBoxes = async (): Promise<void> => {
        try {
            const responseBoxes = await fetch('http://localhost:8080/api/boxes');

            if (!responseBoxes.ok) {
                throw new Error('Failed to fetch data');
            }
            const dataBoxes = await responseBoxes.json();
            console.log(dataBoxes.boxes);
            setBoxes(dataBoxes.boxes);
            setSize(dataBoxes.boxes ? dataBoxes.boxes.length : 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchOrdersAndBoxes(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด
    }, []);

    const handleAddboxes = async () => {
        const newItem = {
            box_name,
            box_height: parseFloat(box_height),
            box_length: parseFloat(box_length),
            box_width: parseFloat(box_width),
            box_maxweight: parseFloat(box_maxweight),
            box_amount: parseInt(box_amount),
            box_id: parseInt(box_id)
        };

        try {
            const response = await fetch('http://localhost:8080/api/boxes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            console.log(newItem)
            if (response.ok) {
                // นำทางไปยังหน้าผลลัพธ์
                alert("adding box complete");
                fetchOrdersAndBoxes();
            } else {
                console.error('Error adding item:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const selectupdateboxes = (boxId: number): void => {
        const selectedBox = boxes.find(({ box_id }) => box_id === boxId);
        if (!selectedBox) {
            console.error("Box not found");
            return;
        }
        else {
            setBoxname_ed(selectedBox.box_name)
            setBoxwidth_ed(selectedBox.box_width)
            setBoxlength_ed(selectedBox.box_length)
            setheBoxheight_ed(selectedBox.box_height)
            setBoxmaxweight_ed(selectedBox.box_maxweight)
            setBoxamount_ed(selectedBox.box_amount)
            setBoxid_ed(selectedBox.box_id)
            setIsDisabled(false);
        }
    }

    const clearUpdateboxes = () => {
        setBoxname("")
        setBoxwidth("")
        setBoxlength("")
        setheBoxheight("")
        setBoxmaxweight("")
        setBoxamount("")
        setBoxid("")
    }
    const clearUpdateboxesed = () => {
        setBoxname_ed("")
        setBoxwidth_ed("")
        setBoxlength_ed("")
        setheBoxheight_ed("")
        setBoxmaxweight_ed("")
        setBoxamount_ed("")
        setBoxid_ed("")
        setIsDisabled(true);
    }

    const handleUpdateboxes = async () => {

        const newItem = {
            box_name: box_name_ed,
            box_height: parseFloat(box_height_ed),
            box_length: parseFloat(box_length_ed),
            box_width: parseFloat(box_width_ed),
            box_maxweight: parseFloat(box_maxweight_ed),
            box_amount: parseInt(box_amount_ed),
            // box_id: parseInt(box_id_ed)
        };

        try {
            const response = await fetch(`http://localhost:8080/api/boxes/${box_id_ed}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            console.log(newItem)
            if (response.ok) {
                // นำทางไปยังหน้าผลลัพธ์
                alert("Updating box complete");
                fetchOrdersAndBoxes();
                clearUpdateboxes();
                setIsDisabled(!isDisabled);

            } else {
                console.error('Error adding item:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteboxes = async (boxId: number): Promise<void> => {
        const confirmDelete = window.confirm("คุณแน่ใจหรือว่าต้องการลบออเดอร์นี้?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/boxes/${boxId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setBoxes(prevOrders => prevOrders.filter(order => order.box_id !== boxId));
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
                <div className="col-span-6">
                    <div className='m-7 '>
                        <div className='mb-3 flex items-center'>
                            <p className='text-2xl font-semibold'>Boxes</p>
                        </div>
                        <div className='flex justify-start'>
                            <div style={{ width: "100%" }}>
                                <div className="overflow-x-auto border rounded-xl border-slate-200">
                                    <table className="table table-zebra text-center">
                                        <thead>
                                            <tr className='bg-cyan-700 text-white text-base'>
                                                <th>Number</th>
                                                <th>Boxsize</th>
                                                <th>Amount</th>
                                                <th>Width</th>
                                                <th>Length</th>
                                                <th>Height</th>
                                                <th>Maxweight</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        {boxes.length > 0 &&
                                            <tbody>
                                                {boxes.map((item, index) => (
                                                    <tr key={index}>
                                                        <th>{index + 1}</th>
                                                        <td>{item.box_name}</td>
                                                        <td>{item.box_amount}</td>
                                                        <td>{item.box_width}</td>
                                                        <td>{item.box_length}</td>
                                                        <td>{item.box_height}</td>
                                                        <td>{item.box_maxweight}</td>
                                                        <td>

                                                            <button className='btn btn-xs bg-orange-300' onClick={() => { selectupdateboxes(item.box_id) }}>แก้ไข</button>

                                                            <button
                                                                className='btn btn-xs ml-5 bg-red-400'
                                                                onClick={() => handleDeleteboxes(item.box_id)}
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
                <div className="col-span-4">
                    {/* addboxes */}
                    <div className='flex justify-center items-center m-24'>
                        <div className="card bg-base-100 w-96 shadow-xl">
                            <div className="card-body">
                                <div className="card-title justify-center"><h2 >เพิ่มกล่อง</h2></div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">ชื่อสินค้า</span>
                                        <input
                                            type="text"
                                            placeholder="ชื่อสินค้า"
                                            value={box_name}
                                            onChange={(e) => setBoxname(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>

                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">ความกว้าง</span>
                                        <input
                                            type="text"
                                            placeholder="เซนติเมตร"
                                            value={box_width}
                                            onChange={(e) => setBoxwidth(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">ความยาว</span>
                                        <input
                                            type="text"
                                            placeholder="เซนติเมตร"
                                            value={box_length}
                                            onChange={(e) => setBoxlength(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">ความสูง</span>
                                        <input
                                            type="text"
                                            placeholder="เซนติเมตร"
                                            value={box_height}
                                            onChange={(e) => setheBoxheight(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">น้ำหนัก</span>
                                        <input
                                            type="text"
                                            placeholder="น้ำหนัก"
                                            value={box_maxweight}
                                            onChange={(e) => setBoxmaxweight(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">จำนวน</span>
                                        <input
                                            type="text"
                                            placeholder="จำนวน"
                                            value={box_amount}
                                            onChange={(e) => setBoxamount(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                </div>
                                <div className="card-actions justify-center">
                                    <button className="btn bg-green-400 btn-sm" onClick={handleAddboxes}>Add</button>

                                    <button className="btn btn-info btn-sm" onClick={clearUpdateboxes}>Clear</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* addboxes */}
                    {/* editboxes */}
                    <div className='flex justify-center items-center'>
                        <div className="card bg-base-100 w-96 shadow-xl">
                            <div className="card-body">
                                <div className="card-title justify-center"><h2 >แก้ไขรายระเอียดกล่อง</h2></div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">ชื่อสินค้า</span>
                                        <input
                                            type="text"
                                            placeholder="ชื่อสินค้า"
                                            value={box_name_ed}
                                            onChange={(e) => setBoxname_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>

                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">ความกว้าง</span>
                                        <input
                                            type="text"
                                            placeholder="เซนติเมตร"
                                            value={box_width_ed}
                                            onChange={(e) => setBoxwidth_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">ความยาว</span>
                                        <input
                                            type="text"
                                            placeholder="เซนติเมตร"
                                            value={box_length_ed}
                                            onChange={(e) => setBoxlength_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">ความสูง</span>
                                        <input
                                            type="text"
                                            placeholder="เซนติเมตร"
                                            value={box_height_ed}
                                            onChange={(e) => setheBoxheight_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">น้ำหนัก</span>
                                        <input
                                            type="text"
                                            placeholder="น้ำหนัก"
                                            value={box_maxweight_ed}
                                            onChange={(e) => setBoxmaxweight_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">จำนวน</span>
                                        <input
                                            type="text"
                                            placeholder="จำนวน"
                                            value={box_amount_ed}
                                            onChange={(e) => setBoxamount_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                </div>
                                <div className="card-actions justify-center">
                                    <button className="btn bg-green-400 btn-sm" onClick={handleUpdateboxes}>Confirm</button>

                                    <button className="btn btn-info btn-sm" onClick={clearUpdateboxesed}>Clear</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* editboxes */}
                </div>
            </div>
        </div>
    )
}

export default Boxesmanage