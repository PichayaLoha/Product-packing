import React, { useState, useEffect } from 'react';
import Menupage from '../menupage';
import { Link, useNavigate } from 'react-router-dom';
import Productcard from './productcard';

interface Product {
    product_id: number;
    product_name: string;
    product_width: number;
    product_length: number;
    product_height: number;
    product_weight: number;
    product_amount: number;
    product_cost: number;
    user_id: number;
    product_image: string;
}


function Productpage() {
    // const navigate = useNavigate();
    const [product, setProduct] = useState<Product[]>([]);
    const [size, setSize] = useState(0);

    // ดึงข้อมูล orders จาก backend เมื่อ component โหลด
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/products');
                const data = await response.json();
                console.log(data.products)
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
    const handleQuantityChange = (product_id: number): void => {
        setProduct(prevOrders => prevOrders.filter(product => product.product_id !== product_id));
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
                        </div>{size > 0 &&
                            <div className='grid grid-cols-4 gap-4'>
                                {product.map((product) => (
                                    <Productcard key={product.product_id} product={product} onQuantityChange={handleQuantityChange} />
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Productpage;
