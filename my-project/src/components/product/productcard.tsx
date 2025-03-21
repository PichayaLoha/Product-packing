import React, { useState } from 'react'
import { Link } from 'react-router-dom'

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




function Productcard({ product, onQuantityChange }: { product: Product; onQuantityChange: (quantity: number) => void; }) {

    const [quantity, setQuantity] = useState<number>(1);
    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

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
                alert("เพิ่มเรียบร้อยแล้ว")
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
        const confirmDelete = window.confirm("คุณแน่ใจหรือว่าต้องการลบออเดอร์นี้?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    onQuantityChange(product.product_id);
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
                        <p className='sm:text-xs md:text-sm xl:text-md'>W x L x H : <label className='text-zinc-500 '>{product.product_width} x {product.product_length} x {product.product_height} cm</label></p>
                    </div>
                    <div>
                        <p className='sm:text-xs md:text-sm xl:text-md'>น้ำหนัก : <label className='text-zinc-500'>{product.product_weight} kg.</label></p>
                    </div>
                    <div>
                        <p className='sm:text-xs md:text-sm xl:text-md'>ราคา : <label className='text-zinc-500'>{product.product_cost} บาท</label></p>
                    </div>
                    <div>
                        <p className='sm:text-xs md:text-sm xl:text-md'>จำนวนสินค้า : <label className='text-zinc-500'>{product.product_amount} ชิ้้น</label></p>
                    </div>
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
                    </div>
                    <div className="card-actions justify-center">
                        <button className="btn btn-success text-white" onClick={() => { handleAddProduct(product.product_id) }}>เพิ่มสินค้า</button>
                        <Link to={`/Editproduct/${product.product_id}`}>
                            <button className="btn btn-primary">แก้ไข</button>
                        </Link>
                        <button className="btn btn-error text-white" onClick={() => handleDeleteProduct(product.product_id)}>ลบ</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Productcard
