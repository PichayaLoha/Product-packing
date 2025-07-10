import { Link, useNavigate } from 'react-router-dom'


function Menupage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const handleLogout = async () => {
        console.log("Logout function called");  // ✅ Debug

        console.log("Token before logout:", token);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("Logout API failed:", response.status);
            }

        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            console.log("Removing token from localStorage...");
            localStorage.removeItem("token");
            console.log("Token after logout:", localStorage.getItem("token"));
            navigate("/login");
            alert("Logged out successfully");
        }
    };

    return (
        <div className="col-span-2 bg-cyan-700">
            <div className='m-5 mt-8'>
                {token && (
                    <div className="bg-green-500 text-white p-2 rounded-lg mb-4 flex items-center shadow-md">
                        <div className="h-2 w-2 bg-lime-300 rounded-full mr-2 animate-pulse"></div>
                        <p className="font-medium truncate">{'User logged in'}</p>
                    </div>
                )}
                <div className='grid justify-center items-center mb-7'>
                    <Link to="/">
                        <p className='font-mono md:text-lg lg:text-3xl xl:text-4xl font-semibold text-white drop-shadow-md transition-all p-3 rounded-xl hover:bg-violet-600'>Plackkhong</p>
                    </Link>
                </div>
                <div className='flex flex-col items-center  drop-shadow-md'>
                    <Link to="/Product">
                        <button className='btn px-8 my-2  drop-shadow-md'>Product</button>
                    </Link>
                    <Link to="/Order">
                        <button className='btn px-9 my-2  drop-shadow-md'>Order</button>
                    </Link>
                    <Link to="/Packing">
                        <button className='btn px-8 my-2  drop-shadow-md'>Generate</button>
                    </Link>
                    <Link to="/History">
                        <button className='btn px-8 my-2  drop-shadow-md'>History</button>
                    </Link>
                    <button className='btn btn-error px-8 my-2  drop-shadow-md' onClick={handleLogout}>ออก</button>

                </div>
            </div>
        </div>
    )
}

export default Menupage