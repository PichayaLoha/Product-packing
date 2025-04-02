import { useEffect, useState } from 'react'
import Menupage from '../menupage';
import { useNavigate } from 'react-router-dom';

interface History {
    package_id: number;
    package_amount: number;
    customer_firstname: string;
    customer_lastname: string;
    package_status: string;
    history_id: number;
    package_product_id: number;
    package_product_name: string;
    package_product_amount: number;
    package_product_cost: number;
}


function History_page() {
    const navegate = useNavigate();
    const [history, setHistory] = useState<History[]>([]);
    const [filteredOrder, setFilteredOrder] = useState<History[]>([]);
    const [size, setSize] = useState(0);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'packed', 'unpacked'

    const fetchOrdersAndBoxes = async () => {
        try {
            const responseOrders = await fetch('http://localhost:8080/api/history');
            const dataOrders = await responseOrders.json();

            console.log("data is:", dataOrders.history);

            setHistory(dataOrders.history);
            setFilteredOrder(dataOrders.history);
            setSize(dataOrders.history ? dataOrders.history.length : 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchOrdersAndBoxes();
    }, []);

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredOrder(history);
        } else {
            const filtered = history.filter(item =>
                item.package_status.toLowerCase() === statusFilter.toLowerCase()
            );
            setFilteredOrder(filtered);
        }
    }, [statusFilter, history]);

    const historyDeletehandle = async (historyId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/history/${historyId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setHistory(prevOrders => prevOrders.filter(order => order.history_id !== historyId));
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
                <div className='m-7'>
                    <div className='mb-3 flex items-center'>
                        <p className='text-2xl font-semibold mr-5'>History</p>
                        {/* Status Filter Dropdown */}
                        <div className="flex items-center">
                            <span className="mr-2 text-lg font-semibold">Status</span>
                            <div className="relative">
                                <select
                                    className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-cyan-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">ทั้งหมด</option>
                                    <option value="packed">Packed</option>
                                    <option value="unpacked">Unpacked</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <div style={{ width: "90%" }}>
                            <div className="overflow-x-auto border rounded-xl border-slate-200">
                                <table className="table bg-stone-600 text-center">
                                    <thead>
                                        <tr className='bg-cyan-700 text-white text-base'>
                                            <th>ลำดับ</th>
                                            <th>จำนวนกล่อง</th>
                                            <th>ชื่อ</th>
                                            <th>status</th>
                                            <th>Total Product cost</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    {size > 0 ? (
                                        <tbody className='text-white text-base'>
                                            {filteredOrder.map((item: History, index: number) => (
                                                <tr key={item.package_id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.package_amount}</td>
                                                    <td>{item.customer_firstname} {item.customer_lastname}</td>
                                                    <td>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.package_status.toLowerCase() === 'packed'
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-yellow-500 text-white'
                                                            }`}>
                                                            {item.package_status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`px-2 py-1 rounded-full font-medium text-md`}>
                                                            {item.package_product_cost} บาท
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className='btn btn-sm bg-green-500 border-green-500 hover:bg-green-600'
                                                            onClick={() => { historyhandle(item.package_id, item.customer_firstname, item.customer_lastname) }}
                                                        >
                                                            รายละเอียด
                                                        </button>
                                                        <button
                                                            className='btn btn-sm ml-2 bg-red-400 border-red-400 hover:bg-red-500'
                                                            onClick={() => { historyDeletehandle(item.package_id) }}
                                                        >
                                                            ลบ
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan={5} className="text-center py-4 text-white">
                                                    ไม่พบข้อมูล
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
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