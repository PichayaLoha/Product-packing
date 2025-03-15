import React, { useEffect, useState } from 'react'
import Menupage from '../menupage';
import { Link, useLocation, useNavigate } from 'react-router-dom';
function Historydetailpage() {
    const navegate = useNavigate();
    const location = useLocation();
    const { message } = location.state;
    const [order, setOrder] = useState([]);
    const [check, setcheck] = useState();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/history/${message}`);
                const data = await response.json();
                console.log("test", data);
                setcheck(data.package_status)
                setOrder(data.history_dels || []);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
            // prevOrders
        };

        fetchOrders(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด
    }, []); // [] ทำให้ useEffect ทำงานเพียงครั้งเดียวเมื่อ component โหลด

    const handleEditItem = async (e) => {
        const value = e.target.getAttribute('data-value');
        console.log(value)
        const updatedItem = {
            package_status: "Packed",
        };
        try {
            const response = await fetch(`http://localhost:8080/api/history/${message}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                alert("อัพเดทสถานะเรียบร้อย")
                navegate('/History'); // นำทางไปยังหน้าผลลัพธ์เมื่อสำเร็จ
                window.location.reload();
            } else {
                console.error('Error updating item:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10 m-5">
                <div className='flex mb-5 items-end'>
                    <p className='text-3xl mr-5'>History</p>
                    {check == "Unpacked" && (
                        <button className='btn btn-sm btn-success' data-value="Packed" onClick={handleEditItem}>Packed</button>
                    )}
                </div>
                <div className='flex justify-center' >
                    <div style={{ width: "90%" }}>
                        <div className="overflow-x-auto border rounded-xl border-slate-200">
                            <table className="table table-zebra text-center">
                                <thead>
                                    <tr className='bg-cyan-700 text-white text-base'>
                                        <th>ลำดับ</th>
                                        <th>ขนาดกล่อง</th>
                                        <th>user-id</th>
                                        <th>ชื่อ</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {/* รายการกล่องทั้งหมดของ orderนั้นๆ */}
                                {order.map((item, index) => (
                                    <tbody>

                                        <tr className='bg-stone-400'>
                                            <th>{index + 1}</th>
                                            <td>{item.package_del_boxsize}</td>
                                            <td>{item.package_del_id}</td>
                                            <td>Bob</td>
                                            <td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={5} className='bg-stone-500'>
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
                                                        {/* รายการของในกล่องนั้นๆ */}
                                                        <tbody>
                                                            {item.package_id.map((item, index) => (
                                                                <tr key={item.package_box_id}>
                                                                    <th>{index + 1}</th>
                                                                    <td >{item.product_name}</td>
                                                                    <td>{item.product_height}</td>
                                                                    <td>{item.product_length}</td>
                                                                    <td>{item.product_width}</td>
                                                                    <td>{item.product_weight}</td>
                                                                    <td>{item.package_box_x}</td>
                                                                    <td>{item.package_box_y}</td>
                                                                    <td>{item.package_box_z}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        {/* รายการของในกล่องนั้นๆ */}
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                ))}
                                {/* รายการกล่องทั้งหมดของ orderนั้นๆ */}
                            </table>
                        </div>
                    </div>
                </div >
            </div>

        </div>

    )
}

export default Historydetailpage