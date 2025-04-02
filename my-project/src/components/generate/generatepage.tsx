import { useEffect, useState } from 'react'
import Menupage from '../menupage';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface History {
    package_del_id: number;
    package_del_boxsize: string;
    package_id: any[];
    package_status: string;
    history_id: number;
}

interface Customer {
    customer_id: number;
    customer_firstname: string;
    customer_lastname: string;
    customer_address: string;
    customer_postal: string;
    customer_phone: string;
    customer_status: string;
    customer_created_at: string;
    customer_updated_at: string;
}

function Generatepage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { message, cus_id } = location.state;
    const [history, setHistory] = useState<History[]>([]);
    const [client, setClient] = useState<Customer | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const customer = await fetch(`http://localhost:8080/api/customers/${cus_id}`);
                const customer_data = await customer.json();
                console.log(customer_data)
                setClient(customer_data.customers[0] || []);

                const response = await fetch(`http://localhost:8080/api/history/${message}`);
                const data = await response.json();
                console.log("generate complete :", data.history_dels);
                console.log(message);
                setHistory(data.history_dels || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
            // prevOrders
        };

        fetchOrders(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด
    }, []); // [] ทำให้ useEffect ทำงานเพียงครั้งเดียวเมื่อ component โหลด

    const handleRowClick = (packageDelId: number) => {
        console.log("📦 ส่งค่า package_dels_id:", packageDelId); // ✅ Debug ตรวจสอบค่าที่ถูกส่งไป
        navigate('/productpacking', { state: { package_dels_id: packageDelId, message: "generate" } });
    };


    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10 m-5">
                <div className='mb-5'>
                    <Link to='/Product'>
                        <button className='btn'>Back to Product page</button>
                    </Link>
                    <p>Total Box : {history.length} Box</p>
                    {/* <p>กล่องขนาด F :[4]    E:[4]    D:[4]    G:[4]   S:[4]   M:[4]    L:[4]</p> */}

                </div>
                <div className='flex justify-center' >
                    <div style={{ width: "90%" }}>
                        <div className="overflow-x-auto border rounded-xl border-slate-200">
                            <table className="table table-zebra text-center">
                                <thead>
                                    <tr className='bg-cyan-700 text-white text-base'>
                                        <th>No.</th>
                                        <th>Box size</th>
                                        <th>Item per box</th>
                                        <th>Customer name</th>
                                        <th>Preview</th>
                                    </tr>
                                </thead>
                                {/* รายการกล่องทั้งหมดของ orderนั้นๆ */}
                                {history.map((item: History, index) => (
                                    <tbody >

                                        <tr key={index} className='bg-stone-400'>
                                            <td>{index + 1}
                                            </td>
                                            <th>{item.package_del_boxsize}</th>
                                            <td>{item.package_id.length}</td>
                                            <td>{client && (client.customer_firstname || client.customer_lastname
                                                ? `${client.customer_firstname} ${client.customer_lastname}`.trim()
                                                : "ไม่ระบุชื่อ")}
                                            </td>
                                            <td><button className='btn btn-sm' onClick={() => handleRowClick(item.package_del_id)}>Preview</button></td>
                                            {/* <td>
                                            </td> */}
                                        </tr>

                                        <tr>
                                            <td colSpan={6} className='bg-stone-500'>
                                                <div className="p-5 overflow-x-auto bg-white">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th>Number</th>
                                                                <th>Product Name</th>
                                                                <th>Height</th>
                                                                <th>Length</th>
                                                                <th>Width</th>
                                                                <th>Weight</th>
                                                                <th>X</th>
                                                                <th>Y</th>
                                                                <th>Z</th>
                                                            </tr>
                                                        </thead>
                                                        {/* รายการของในกล่องนั้นๆ */}
                                                        <tbody>
                                                            {item.package_id.map((item, index) => (
                                                                <tr key={index}>
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

export default Generatepage
