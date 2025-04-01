import { useState, useEffect } from 'react';
import Menupage from '../menupage';
import { Link } from 'react-router-dom';
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
    product_time: string; // เพิ่ม product_time
}

function Productpage() {
    const [product, setProduct] = useState<Product[]>([]);
    const [size, setSize] = useState(0);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest'); // สถานะสำหรับการเรียงลำดับ

    // ดึงข้อมูล products จาก backend เมื่อ component โหลด
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/products');
                const data = await response.json();
                console.log(data.products);
                // เรียงลำดับข้อมูลตาม product_time
                sortProductsByTime(data.products, sortOrder);
                setSize(data.products ? data.products.length : 0);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []); // [] ทำให้ useEffect ทำงานเพียงครั้งเดียวเมื่อ component โหลด

    // ฟังก์ชันเรียงลำดับสินค้าตามเวลา
    const sortProductsByTime = (products: Product[], order: 'newest' | 'oldest') => {
        const sortedProducts = [...products].sort((a, b) => {
            const timeA = new Date(a.product_time).getTime();
            const timeB = new Date(b.product_time).getTime();
            return order === 'newest' ? timeB - timeA : timeA - timeB;
        });
        setProduct(sortedProducts);
    };

    // สลับการเรียงลำดับ
    const toggleSortOrder = () => {
        const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
        setSortOrder(newOrder);
        sortProductsByTime(product, newOrder);
    };

    const handleQuantityChange = (product_id: number): void => {
        setProduct(prevProducts => {
            const updatedProducts = prevProducts.filter(product => product.product_id !== product_id);
            return updatedProducts;
        });
    };

    return (
        <div>
            <div className="grid grid-cols-12 h-screen">
                <Menupage />
                <div className="col-span-10">
                    <div className='m-7 '>
                        <div className='mb-3 flex items-center justify-between'>
                            <div className='flex items-center'>
                                <p className='text-2xl font-semibold'>Product</p>
                                <Link to='/Addproduct'>
                                    <button className='btn btn-outline bg-sky-900 ml-5 text-lg text-white'>Add Product</button>
                                </Link>
                            </div>
                            <div>
                                <button 
                                    onClick={toggleSortOrder} 
                                    className='btn btn-outline flex items-center gap-2'
                                >
                                    <span>เรียงตามเวลา: {sortOrder === 'newest' ? 'ใหม่-เก่า' : 'เก่า-ใหม่'}</span>
                                    <span className='text-xl'>{sortOrder === 'newest' ? '↓' : '↑'}</span>
                                </button>
                            </div>
                        </div>
                        {size > 0 &&
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