import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
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
    product_time: string; // Added product_time field
}

function Productcard({ product, userId,userRole, onQuantityChange }: { product: Product; userId: string;userRole:boolean; onQuantityChange: (quantity: number) => void; }) {

    const [quantity, setQuantity] = useState<number>(1);

    const increment = () => {
        if (quantity < product.product_amount) {
            return setQuantity((prev) => prev + 1);
        }
    }
    const decrement = () => {
        if (quantity >= 1) {
            setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
        }
    }

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
            console.log(newItem)
            if (response.ok) {
                alert("Added successfully.")
                setQuantity(1);
                // navigate('/Order');
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
                    onQuantityChange(product.product_id);
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
        <div>
            <div className="bg-base-500 shadow-xl rounded-xl sm:px-0 xl:px-5 p-5 ">
                <figure className="flex justify-center w-full h-60 ">
                    <img style={{ width: "70%", height: "90%" }}
                        src={product.product_image}
                        alt="Shoes"
                        className="rounded-xl object-contain" />
                </figure>
                <div className="inline text-center justify-center">
                    <div className='my-1'>
                        <p className=" text-center text-xl">{product.product_name}!</p>
                    </div>
                    <div>
                        <p className='sm:text-xs md:text-sm xl:text-md'>W x L x H : <label className='text-zinc-500 '>{product.product_width} x {product.product_length} x {product.product_height} cm.</label></p>
                    </div>
                    <div>
                        <p className='sm:text-xs md:text-sm xl:text-md'>Weight : <label className='text-zinc-500'>{product.product_weight} kg.</label></p>
                    </div>
                    <div>
                        <p className='sm:text-xs md:text-sm xl:text-md'>Price : <label className='text-zinc-500'>{product.product_cost} baht</label></p>
                    </div>
                    <div>
                        <p className='sm:text-xs md:text-sm xl:text-md'>Amount : <label className='text-zinc-500'>{product.product_amount} pieces</label></p>
                    </div>
                    <div>
                        <p className='sm:text-xs md:text-sm xl:text-md'>Created at : <label className='text-zinc-500'>{new Date(product.product_time).toLocaleDateString('th-TH')}</label></p>
                    </div>
                    {userRole && (
                        <div className="card-actions justify-center my-1">

                            <div className="flex items-center space-x-0">
                                <button onClick={decrement} className="btn btn-square btn-sm btn-outline btn-error"> - </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    onChange={(e) => {
                                        setQuantity(Number(e.target.value))
                                    }
                                    }
                                    className="py-1 w-14 border rounded-md text-center"
                                />
                                <button onClick={increment} className="btn btn-square btn-sm btn-outline btn-success"> + </button>
                            </div>
                        </div>)}

                    {userRole && (
                        <div className="card-actions justify-center">
                            <button className="btn btn-success text-white" onClick={() => { handleAddProduct(product.product_id) }}>Add</button>

                            <Link to={`/Editproduct/${product.product_id}`} state={{ "userId": userId }}>
                                <button className="btn btn-primary">Edit</button>
                            </Link>
                            <button className="btn btn-error text-white" onClick={() => handleDeleteProduct(product.product_id)}>Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Productcard