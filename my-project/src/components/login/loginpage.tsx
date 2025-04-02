import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../auth/AuthContext";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const authContext = useContext(AuthContext);
    if (!authContext) return <p>Loading...</p>;

    const { setToken, setUserId } = authContext;  // ✅ ใช้ setUserId

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_name: username, user_password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUserId(data.user_id);  // ✅ เก็บ user_id ใน Context
                setToken(data.token, 120);
                console.log("Token:", data.token);
                console.log("UserID:", data.user_id);
                alert("Login Success!");
                navigate("/");
            } else {
                setError(data.error || "Invalid username or password.");
            }
        } catch (error) {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-indigo-700">Product-Packing</h1>
                </div>

                <div className="bg-white rounded-xl shadow-xl">
                    <div className="bg-indigo-600 p-4">
                        <h2 className="text-white text-xl font-medium text-center">Login</h2>
                    </div>

                    <form className="p-6" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Username</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="input input-bordered w-full"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="input input-bordered w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-red-600">{error}</p>}

                        <button type="submit" className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full mb-4">
                            Sign In
                        </button>

                        <button 
                            type="button" 
                            className="btn bg-gray-500 hover:bg-gray-600 text-white w-full"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
