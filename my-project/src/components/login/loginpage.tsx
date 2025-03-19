import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_name: username, user_password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("login success");
                navigate("/");
            } else {
                setError(data.error || "Invalid username or password.");
            }
        } catch (error) {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-indigo-700">Product-Packing</h1>

                </div>
                
                {/* Card */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-indigo-600 p-4">
                        <h2 className="text-white text-xl font-medium text-center">Login</h2>
                    </div>
                    
                    {/* Form */}
                    <form className="p-6" onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="input input-bordered w-full bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="input input-bordered w-full bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}
                        
                        <div className="form-control mt-6">
                            <button 
                                type="submit" 
                                className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-md transition-colors duration-200"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    );
};

export default Login;