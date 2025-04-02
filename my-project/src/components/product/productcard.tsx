import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Product interface for TypeScript
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

interface ProductCardProps {
    product: Product;
    userId: string;
    userRole: boolean;
    onQuantityChange: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userId, userRole, onQuantityChange }) => {
    const [quantity, setQuantity] = useState<number>(1);

    const increment = () => {
        if (quantity < product.product_amount) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddProduct = async (productId: number) => {
        const newItem = {
            product_id: productId,
            product_amount: quantity,
        };

        try {
            const response = await fetch('http://localhost:8080/api/orderdels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                alert("Added successfully.");
                setQuantity(1);
            } else {
                console.error('Error adding item:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    onQuantityChange(productId);
                    alert("Product has been successfully deleted.");
                } else {
                    console.error('Error deleting product:', response.statusText);
                    alert("An error occurred while deleting the product.");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div className="bg-base-500 shadow-xl rounded-xl p-5 flex flex-col h-full">
            <figure className="flex justify-center w-full h-60 mb-3">
                <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="rounded-xl object-contain w-4/5 h-full"
                />
            </figure>
            <div className="flex flex-col flex-grow">
                <div className="mb-2">
                    <p className="text-center text-xl font-medium">{product.product_name}</p>
                </div>
                <div className="space-y-1 flex-grow text-center justify-center">
                    <p className="text-sm">W x L x H: <span className="text-zinc-500">{product.product_width} x {product.product_length} x {product.product_height} cm.</span></p>
                    <p className="text-sm">Weight: <span className="text-zinc-500">{product.product_weight} kg.</span></p>
                    <p className="text-sm">Price: <span className="text-zinc-500">{product.product_cost} baht</span></p>
                    <p className="text-sm">Amount: <span className="text-zinc-500">{product.product_amount} pieces</span></p>
                    <p className="text-sm">Created at: <span className="text-zinc-500">{new Date(product.product_time).toLocaleDateString('th-TH')}</span></p>
                </div>
                {product.product_amount === 0 && (
                    <div>
                        <div className="text-red-600 text-xl font-bold text-center mt-2">Out of stock</div>
                        <div className='flex justify-center gap-2 mt-2'>
                            <Link to={`/Editproduct/${product.product_id}`} state={{ "userId": userId }}>
                                <button className="btn btn-primary">Edit</button>
                            </Link>
                            <button
                                className="btn btn-error text-white"
                                onClick={() => handleDeleteProduct(product.product_id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                )}
                {userRole && product.product_amount > 0 && (
                    <div className="mt-auto">
                        <div className="flex justify-center my-2">
                            <div className="flex items-center space-x-1">
                                <button onClick={decrement} className="btn btn-square btn-sm btn-outline btn-error">-</button>
                                <input
                                    type="text"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="py-1 w-14 border rounded-md text-center"
                                />
                                <button onClick={increment} className="btn btn-square btn-sm btn-outline btn-success">+</button>
                            </div>
                        </div>
                        <div className="flex justify-center gap-2">
                            <button
                                className="btn btn-success text-white"
                                onClick={() => handleAddProduct(product.product_id)}
                            >
                                Add
                            </button>
                            <Link to={`/Editproduct/${product.product_id}`} state={{ "userId": userId }}>
                                <button className="btn btn-primary">Edit</button>
                            </Link>
                            <button
                                className="btn btn-error text-white"
                                onClick={() => handleDeleteProduct(product.product_id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;