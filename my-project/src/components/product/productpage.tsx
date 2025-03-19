import React, { useState, useEffect } from 'react';
import Menupage from '../menupage';
import { Link, } from 'react-router-dom';
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
    product_image: string
}

interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    card: string;
}

const themes: Record<string, ThemeColors> = {
    default: {
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-purple-500 hover:bg-purple-600',
        accent: 'bg-amber-500',
        background: 'bg-gray-50',
        text: 'text-gray-800',
        card: 'bg-white'
    },
    dark: {
        primary: 'bg-blue-500 hover:bg-blue-600',
        secondary: 'bg-purple-600 hover:bg-purple-700',
        accent: 'bg-amber-500',
        background: 'bg-gray-900',
        text: 'text-gray-100',
        card: 'bg-gray-800'
    },
};

function Productpage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTheme, setCurrentTheme] = useState<string>('default');
    const [isGridView, setIsGridView] = useState(true);
    const [sortBy, setSortBy] = useState<string>('default');

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data.products || []);
                setError(null);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products. Please try again later.');
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDeleteProduct = (product_id: number) => {
        setProducts(prevProducts => prevProducts.filter(product => product.product_id !== product_id));
    }
    // const handleQuantityChange = (product_id: number) => {
    //     setProducts(prevOrders => prevOrders.filter(product => product.product_id !== product_id));
    // };

    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.product_name.localeCompare(b.product_name);
            case 'price-asc':
                return a.product_cost - b.product_cost;
            case 'price-desc':
                return b.product_cost - a.product_cost;
            case 'quantity':
                return b.product_amount - a.product_amount;
            default:
                return 0;
        }
    });


    const EmptyState = () => (
        <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-2">ไม่พบสินค้า</h3>
            <p className="text-gray-500 mb-6">เพิ่มสินค้าใหม่เพื่อเริ่มต้นการใช้งาน</p>
            <Link to="/Addproduct">
                <button className="px-6 py-3 text-black bg-gray-300 rounded-lg shadow-lg flex items-center mx-auto">
                    เพิ่มสินค้าใหม่
                </button>
            </Link>
        </div>
    );

    return (
        <div className={`min-h-screen  transition-colors duration-300`}>
            <div className="grid grid-cols-12 min-h-screen">
                <Menupage />
                <div className="col-span-10 overflow-y-auto">
                    <div className="p-8">
                        {/* Header and Top Controls */}
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                                <h1 className={`text-3xl font-bold `}>สินค้าทั้งหมด</h1>
                                <div className="flex items-center gap-2">
                                    <Link to="/Addproduct">
                                        <button className={`px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center`}>
                                            เพิ่มสินค้า
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Search and Filter Controls */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative ">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className={`block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent `}
                                        placeholder="ค้นหาสินค้า..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        className={`px-3 py-2 border border-gray-300 rounded-lg `}
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="default">เรียงลำดับ</option>
                                        <option value="name">ชื่อสินค้า</option>
                                        <option value="price-asc">ราคา (ต่ำ-สูง)</option>
                                        <option value="price-desc">ราคา (สูง-ต่ำ)</option>
                                        <option value="quantity">จำนวนคงเหลือ</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 `}></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm" role="alert">
                                <div className="flex items-center">
                                    <svg className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-medium">{error}</p>
                                </div>
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedProducts.map((product) => (
                                    <Productcard
                                        key={product.product_id}
                                        product={product}
                                        onQuantityChange={handleDeleteProduct}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Productpage;