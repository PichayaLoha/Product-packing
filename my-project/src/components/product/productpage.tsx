import React, { useState, useEffect } from 'react';
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
    forest: {
        primary: 'bg-emerald-600 hover:bg-emerald-700',
        secondary: 'bg-teal-500 hover:bg-teal-600',
        accent: 'bg-amber-400',
        background: 'bg-emerald-50',
        text: 'text-emerald-900',
        card: 'bg-white'
    },
    sunset: {
        primary: 'bg-orange-500 hover:bg-orange-600',
        secondary: 'bg-red-500 hover:bg-red-600',
        accent: 'bg-yellow-400',
        background: 'bg-orange-50',
        text: 'text-gray-800',
        card: 'bg-white'
    },
    ocean: {
        primary: 'bg-cyan-600 hover:bg-cyan-700',
        secondary: 'bg-blue-500 hover:bg-blue-600',
        accent: 'bg-teal-400',
        background: 'bg-cyan-50',
        text: 'text-gray-800',
        card: 'bg-white'
    }
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
    };

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

    const theme = themes[currentTheme];

    const EmptyState = () => (
        <div className={`text-center py-16 ${theme.text}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-2xl font-bold mb-2">ไม่พบสินค้า</h3>
            <p className="text-gray-500 mb-6">เพิ่มสินค้าใหม่เพื่อเริ่มต้นการใช้งาน</p>
            <Link to="/Addproduct">
                <button className={`px-6 py-3 ${theme.primary} text-white rounded-lg shadow-lg flex items-center mx-auto`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    เพิ่มสินค้าใหม่
                </button>
            </Link>
        </div>
    );

    return (
        <div className={`min-h-screen ${theme.background} transition-colors duration-300`}>
            <div className="grid grid-cols-12 min-h-screen">
                <Menupage />
                <div className="col-span-10 overflow-y-auto">
                    <div className="p-8">
                        {/* Header and Top Controls */}
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                                <h1 className={`text-3xl font-bold ${theme.text}`}>สินค้าทั้งหมด</h1>
                                <div className="flex items-center gap-2">
                                    <Link to="/Addproduct">
                                        <button className={`px-4 py-2 ${theme.primary} text-white rounded-lg shadow-md transition-colors duration-200 flex items-center`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            เพิ่มสินค้า
                                        </button>
                                    </Link>
                                    <div className="relative">
                                        <button className={`px-3 py-2 rounded-lg transition-colors duration-200 ${theme.secondary} text-white`} onClick={() => setIsGridView(!isGridView)}>
                                            {isGridView ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Search and Filter Controls */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme.card}`}
                                        placeholder="ค้นหาสินค้า..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <select 
                                        className={`px-3 py-2 border border-gray-300 rounded-lg ${theme.card}`}
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="default">เรียงลำดับ</option>
                                        <option value="name">ชื่อสินค้า</option>
                                        <option value="price-asc">ราคา (ต่ำ-สูง)</option>
                                        <option value="price-desc">ราคา (สูง-ต่ำ)</option>
                                        <option value="quantity">จำนวนคงเหลือ</option>
                                    </select>
                                    <select 
                                        className={`px-3 py-2 border border-gray-300 rounded-lg ${theme.card}`}
                                        value={currentTheme}
                                        onChange={(e) => setCurrentTheme(e.target.value)}
                                    >
                                        <option value="default">ธีมปกติ</option>
                                        <option value="dark">ธีมมืด</option>
                                        <option value="forest">ธีมป่าไม้</option>
                                        <option value="sunset">ธีมพระอาทิตย์ตก</option>
                                        <option value="ocean">ธีมทะเล</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${theme.primary.split(' ')[0].replace('bg-', 'border-')}`}></div>
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
                        ) : isGridView ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedProducts.map((product) => (
                                    <Productcard 
                                        key={product.product_id} 
                                        product={product} 
                                        onQuantityChange={handleDeleteProduct}
                                        theme={theme}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={`rounded-lg shadow-sm overflow-hidden ${theme.card}`}>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className={`${theme.primary.split(' ')[0]} text-white`}>
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ชื่อสินค้า</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ขนาด (กxยxส)</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">น้ำหนัก</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">จำนวน</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ราคา</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`${theme.card} divide-y divide-gray-200`}>
                                        {sortedProducts.map((product) => (
                                            <tr key={product.product_id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium">{product.product_name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm">{product.product_width} x {product.product_length} x {product.product_height}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm">{product.product_weight}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm">{product.product_amount}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium">{product.product_cost.toLocaleString()} บาท</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className={`text-blue-600 hover:text-blue-900 mr-3`}>แก้ไข</button>
                                                    <button 
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => handleDeleteProduct(product.product_id)}
                                                    >
                                                        ลบ
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Productpage;