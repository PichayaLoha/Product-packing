import React, { useEffect, useState } from 'react'
import Menupage from '../menupage';
import { useLocation, useNavigate } from 'react-router-dom';

// Define a specific interface for a product within a package
interface Product {
    package_box_id: number;
    product_name: string;
    product_height: number;
    product_length: number;
    product_width: number;
    product_weight: number;
    package_box_x: number;
    package_box_y: number;
    package_box_z: number;
    product_image: string;
}

// Define the main order item interface, ensuring package_id is an array of Products
interface OrderItem {
    package_del_id: number;
    package_del_boxsize: string;
    package_id: Product[];
    user_firstname?: string; // Optional as it might not be present on all items
    user_lastname?: string; // Optional
}

function Historydetailpage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { message, f_name, l_name } = location.state || {};

    const [order, setOrder] = useState<OrderItem[]>([]);
    const [check, setCheck] = useState(''); // Initialize with empty string
    const [create_firstname, setCreateFirstname] = useState(''); // Initialize with empty string
    const [create_lastname, setCreateLastname] = useState(''); // Initialize with empty string

    useEffect(() => {
        const fetchOrders = async () => {
            // Only fetch if the message (ID) exists
            if (!message) return;

            try {
                console.log("Fetching history for ID:", message);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${message}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("API Response:", data);

                // Sanitize the incoming data to ensure it matches our interface
                const sanitizedHistory = (data.history_dels || []).map((item: any) => ({
                    ...item,
                    // Ensure package_id is always an array to prevent .map() errors
                    package_id: Array.isArray(item.package_id) ? item.package_id : [],
                }));

                setOrder(sanitizedHistory);
                setCheck(data.package_status || '');

                // Set creator's name from the first item if available
                if (sanitizedHistory.length > 0) {
                    setCreateFirstname(sanitizedHistory[0].user_firstname || '');
                    setCreateLastname(sanitizedHistory[0].user_lastname || '');
                }

            } catch (error) {
                console.error('Error fetching history details:', error);
            }
        };

        fetchOrders();
    }, [message]); // Dependency array ensures this runs when `message` changes

    const updateStatus = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${message}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ package_status: "Packed" }),
            });
            if (response.ok) {
                alert("Update status success");
                navigate('/history');
            } else {
                console.error('Error updating status:', response.statusText);
                alert("Failed to update status.");
            }
        }
        catch (error) {
            console.error('Error during status update:', error);
            alert("An error occurred while updating status.");
        }
    }

    const handleRowClick = (packageDelId: number) => {
        console.log("Navigating to 3D view for package detail ID:", packageDelId);
        navigate('/productpacking', { state: { package_dels_id: packageDelId, message: message, cus_firstname: f_name, cus_lastname: l_name } });
    };

    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10 m-5">
                <div className='flex mb-5 items-end justify-between'>
                    <div>
                        <p className='text-3xl'>History Detail</p>
                        <p className='text-xl mt-2'>Created by: {create_firstname} {create_lastname}</p>
                    </div>
                    {check === "Unpacked" && (
                        <button className='btn btn-success' onClick={updateStatus}>
                            Mark as Packed
                        </button>
                    )}
                </div>

                <div className='flex justify-center'>
                    <div style={{ width: "90%" }}>
                        <div className="overflow-x-auto border rounded-xl border-slate-200">
                            <table className="table table-zebra text-center">
                                <thead>
                                    <tr className='bg-cyan-700 text-white text-base'>
                                        <th>No.</th>
                                        <th>Box Size</th>
                                        <th>Items per Box</th>
                                        <th>Customer Name</th>
                                        <th>3D Preview</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.map((item, index) => (
                                        <React.Fragment key={item.package_del_id}>
                                            <tr className='bg-stone-400 hover:bg-stone-500'>
                                                <th>{index + 1}</th>
                                                <td>{item.package_del_boxsize}</td>
                                                {/* Safely access length because we ensured package_id is an array */}
                                                <td>{item.package_id.length}</td>
                                                <td>{f_name} {l_name}</td>
                                                <td><button className='btn btn-sm btn-info' onClick={() => handleRowClick(item.package_del_id)}>Preview</button></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={5} className='p-0 bg-stone-200'>
                                                    <div className="p-4 overflow-x-auto bg-white">
                                                        <table className="table table-compact w-full text-center">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Product Name</th>
                                                                    <th>Image</th>
                                                                    <th>Height</th>
                                                                    <th>Length</th>
                                                                    <th>Width</th>
                                                                    <th>Weight</th>
                                                                    <th>Pos (X,Y,Z)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {/* Safely map because we ensured package_id is an array */}
                                                                {item.package_id.map((product, productIndex) => (
                                                                    <tr key={product.package_box_id}>
                                                                        <th>{productIndex + 1}</th>
                                                                        <td>{product.product_name}</td>
                                                                        <td>
                                                                            <figure className="flex justify-center w-full h-16">
                                                                                <img src={product.product_image} alt={product.product_name} className="rounded-md object-contain" />
                                                                            </figure>
                                                                        </td>
                                                                        <td>{product.product_height}</td>
                                                                        <td>{product.product_length}</td>
                                                                        <td>{product.product_width}</td>
                                                                        <td>{product.product_weight}</td>
                                                                        <td>{`${product.package_box_x}, ${product.package_box_y}, ${product.package_box_z}`}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Historydetailpage;
