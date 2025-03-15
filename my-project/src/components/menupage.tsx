import React from 'react'
import { Link } from 'react-router-dom'


function menupage() {

    return (
        <div className="col-span-2 bg-purple-500 h-screen">
            <div className='m-5 mt-8'>
                <div className='grid justify-center items-center mb-7'>
                    <Link to="/">
                        <p className='font-mono md:text-lg lg:text-3xl xl:text-4xl font-semibold text-white drop-shadow-md transition-all p-3 rounded-xl hover:bg-violet-600'>Plackkhong</p>
                    </Link>
                </div>
                <div className='flex flex-col items-center   drop-shadow-md'>
                    <Link to="/Product">
                        <button className='btn px-8 my-2  drop-shadow-md'>Product</button>
                    </Link>
                    <Link to="/Order">
                        <button className='btn px-9 my-2  drop-shadow-md'>Order</button>
                    </Link>
                    <Link to="/Packing">
                        <button className='btn px-8 my-2  drop-shadow-md'>Packing</button>
                    </Link>
                    <Link to="/History">
                        <button className='btn px-8 my-2  drop-shadow-md'>History</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default menupage