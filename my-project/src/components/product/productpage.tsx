import React, { useState, useEffect } from 'react';
import Menupage from '../menupage';
import { Link } from 'react-router-dom';

function Productpage() {
    const [product, setProduct] = useState([]);
    const [size, setSize] = useState(0);

    const [value, setValue] = useState<number>(1);
    const increment = () => setValue((prev) => prev + 1);
    const decrement = () => setValue((prev) => (prev > 1 ? prev - 1 : 1));

    // ดึงข้อมูล orders จาก backend เมื่อ component โหลด
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/products');
                const data = await response.json();
                console.log(size)
                setProduct(data.products);
                setSize(data.products ? data.products.length : 0) // เข้าถึง array orders จาก key 'Products'
            } catch (error) {
                console.error('Error fetching products:', error);
            }
            // prevOrders
        };

        fetchOrders(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด
    }, []); // [] ทำให้ useEffect ทำงานเพียงครั้งเดียวเมื่อ component โหลด

    // 
    const handleAddProduct = async (productId) => {
        const confirmDelete = window.confirm("คุณแน่ใจหรือว่าต้องการลบออเดอร์นี้?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setProduct(prevOrders => prevOrders.filter(product => product.product_id !== productId));
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
                <div className="col-span-10">
                    <div className='m-7 '>
                        <div className='mb-3 flex items-center'>
                            <p className='text-2xl font-semibold'>Product</p>
                            <Link to='/Addproduct'>
                                <button className='btn bg-sky-900 ml-5 text-lg text-white'>Add Product</button>
                            </Link>
                        </div>
                        <div className='grid grid-cols-4 gap-4'>
                            {/* card */}
                            <div className="bg-base-500 shadow-xl rounded-xl sm:px-0 xl:px-5 p-5 ">
                                <figure className="flex justify-center">
                                    <img width={250} height={250}
                                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                        alt="Shoes"
                                        className="rounded-xl shadow-md" />
                                </figure>
                                <div className="inline text-center justify-center">
                                    <div className='my-1'>
                                        <p className=" text-center text-xl">Shoes!</p>
                                    </div>
                                    <div>
                                        <p className='sm:text-xs md:text-sm xl:text-md'>W x L x H : <label className='text-zinc-500 '>50 x 50 x 50</label></p>
                                    </div>
                                    <div>
                                        <p className='sm:text-xs md:text-sm xl:text-md'>น้ำหนัก : <label className='text-zinc-500'>50 g.</label></p>
                                    </div>
                                    <div>
                                        {/* <p className='sm:text-xs md:text-sm xl:text-md'>ราคา : <label className='text-zinc-500'>50 บาท</label></p> */}น
                                    </div>
                                    <div className="card-actions justify-center my-1">
                                        <div className="flex items-center space-x-0">
                                            <button onClick={decrement} className="btn btn-square btn-sm btn-outline btn-error"> - </button>
                                            <input
                                                type="number"
                                                value={value}
                                                readOnly
                                                className="py-1 w-14 border rounded-md text-center"
                                            />
                                            <button onClick={increment} className="btn btn-square btn-sm btn-outline btn-success"> + </button>
                                        </div>
                                    </div>
                                    <div className="card-actions justify-center">
                                        <button className="btn btn-success text-white" onClick={handleAddProduct}>เพิ่มสินค้า</button>
                                        <Link to='/Editproduct/:product_id'>
                                            <button className="btn btn-primary">แก้ไข</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* card */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Productpage;
