import React, { useEffect, useState } from 'react'
import Menupage from '../menupage';
import { useNavigate } from 'react-router-dom';
function History_page() {
    const navegate = useNavigate();
    const [order, setOrder] = useState([]);
    const [size, setSize] = useState(0);

    const fetchOrdersAndBoxes = async () => {
        try {
            const responseOrders = await fetch('http://localhost:8080/api/history');
            const dataOrders = await responseOrders.json();

            console.log("data is:", dataOrders.history);

            setOrder(dataOrders.history);// เข้าถึง array orders จาก key 'orders'
            setSize(dataOrders.history ? dataOrders.history.length : 0)
            // เข้าถึง array boxes จาก key 'boxes'
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchOrdersAndBoxes(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด
    }, []);

    const historyDeletehandle = async (historyId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/history/${historyId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setOrder(prevOrders => prevOrders.filter(order => order.history_id !== historyId));
                alert("ลบเรียบร้อยแล้ว");
                fetchOrdersAndBoxes();
            } else {
                console.error('Error deleting product:', response.statusText);
                alert("เกิดข้อผิดพลาดในการลบประวัติ");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const historyhandle = (historyId: number, firstname: string, lastname: string) => {
        console.log(historyId);
        navegate('/Historydetail', { state: { message: historyId, f_name: firstname, l_name: lastname } });

    }

    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10">
                <div className='m-7 '>
                    <div className='mb-3 flex items-center'>
                        <p className='text-2xl font-semibold'>History</p>
                    </div>
                    <div className='flex justify-center'>
                        <div style={{ width: "90%" }}>
                            <div className="overflow-x-auto border rounded-xl border-slate-200">
                                <table className="table bg-stone-600  text-center">
                                    <thead>
                                        <tr className='bg-cyan-700 text-white text-base'>
                                            <th>ลำดับ</th>
                                            <th>จำนวนกล่อง</th>
                                            <th>ชื่อ</th>
                                            <th>status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    {size > 0 && (
                                        <tbody className='text-white text-base'>
                                            {order.map((item, index) => (
                                                <tr key={item.package_id}>
                                                    <td>{index + 1}</td>
                                                    {/* <Link></Link> */}
                                                    <td>{item.package_amount}</td>
                                                    <td>{item.customer_firstname} {item.customer_lastname}</td>
                                                    <td>{item.package_status}</td>
                                                    <td>
                                                        {/* <Link to='/Historydetail'> */}

                                                        <button className='btn btn-sm bg-green-500 border-green-500' onClick={() => { historyhandle(item.package_id, item.customer_firstname, item.customer_lastname) }}>รายละเอียด</button>
                                                        {/* </Link> */}
                                                        <button className='btn btn-sm ml-2 bg-red-400 border-red-400' onClick={() => { historyDeletehandle(item.package_id) }}>ลบ</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>)}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default History_page