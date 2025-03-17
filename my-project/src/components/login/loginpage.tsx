import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ใช้สำหรับ Redirect
import Menupage from '../menupage';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const navigate = useNavigate(); // ✅ Hook สำหรับ Redirect

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
                console.log("เข้าไหมนิ")
                localStorage.setItem("token", data.token); // ✅ เก็บ Token ไว้
                alert("login success")
                navi
                // navigate("/dashboard"); // ✅ Redirect ไป Dashboard
            } else {
                setError(data.error || "Invalid username or password.");
            }
        } catch (error) {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        }
    };

    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10 bg-base-200 flex justify-center items-center">
                <div className="card w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="input input-bordered"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="input input-bordered"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
