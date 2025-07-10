import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Menupage from '../menupage';
import Productcard from './productcard';
import { AuthContext } from '../auth/AuthContext';

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
    product_time: string;
}

function Productpage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [size, setSize] = useState(0);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [userId, setUserId] = useState<string>("");

    const auth = useContext(AuthContext);
    const userRole = auth?.userRole || localStorage.getItem("user_role");
    const canEditOrDelete = userRole === "admin" || userRole === "inventory manager";

    const authContext = useContext(AuthContext);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        setUserId(userId || "");

        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                const data = await response.json();
                console.log('Fetched data from API:', data);
                const productsToProcess = Array.isArray(data) ? data : [];
                sortProductsByTime(productsToProcess, sortOrder);
                setSize(productsToProcess.length);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [authContext, sortOrder]);

    const sortProductsByTime = (products: Product[], order: 'newest' | 'oldest') => {
        const sortedProducts = [...products].sort((a, b) => {
            const timeA = new Date(a.product_time).getTime();
            const timeB = new Date(b.product_time).getTime();
            return order === 'newest' ? timeB - timeA : timeA - timeB;
        });
        setProducts(sortedProducts);
    };

    const toggleSortOrder = () => {
        const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
        setSortOrder(newOrder);
        sortProductsByTime(products, newOrder);
    };

    const handleQuantityChange = (product_id: number) => {
        setProducts(prevProducts => prevProducts.filter(product => product.product_id !== product_id));
    };

    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10">
                <div className='m-7'>
                    <div className='mb-3 flex items-center justify-between'>
                        <div className='flex items-center'>
                            <p className='text-2xl font-semibold'>Product</p>
                            {canEditOrDelete && (
                                <Link to='/Addproduct' state={{ "userId": userId }}>
                                    <button className='btn btn-outline bg-sky-900 ml-5 text-lg text-white'>Add Product</button>
                                </Link>
                            )}
                        </div>
                        <button onClick={toggleSortOrder} className='btn btn-outline flex items-center gap-2'>
                            <span>Sort by time: {sortOrder === 'newest' ? 'Newest-Oldest' : 'Oldest-Newest'}</span>
                            <span className='text-xl'>{sortOrder === 'newest' ? '↓' : '↑'}</span>
                        </button>
                    </div>

                    {size > 0 && (
                        <div className='grid grid-cols-4 gap-4'>
                            {products.map(product => (
                                <Productcard key={product.product_id} product={product} userId={userId} userRole={canEditOrDelete} onQuantityChange={handleQuantityChange} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Productpage;
