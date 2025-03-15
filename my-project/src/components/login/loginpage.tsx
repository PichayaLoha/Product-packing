import React, { useState } from 'react';
import Menupage from '../menupage';
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // สมมติว่ามีฟังก์ชัน validateCredentials ที่ตรวจสอบ username และ password
        if (validateCredentials(username, password)) {
            // รหัสผ่านถูกต้อง, ทำการ login
            console.log('Login successful');
            setError(''); // ล้างข้อความ error
            // ... ทำการ login ...
        } else {
            // รหัสผ่านไม่ถูกต้อง, แสดง error
            setError('Invalid username or password.');
        }
    };

    const validateCredentials = (username: string, password: string): boolean => {
        // แทนที่ด้วย logic การตรวจสอบรหัสผ่านของคุณ
        // ตัวอย่างง่ายๆ:
        return username === 'testuser' && password === 'password123';
    };

    return (
        <div className="grid grid-cols-12 h-screen">
            <Menupage />
            <div className="col-span-10 bg-base-200">
                <div className="flex justify-center items-center h-screen">
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Username</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="username"
                                    className="input input-bordered"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="password"
                                    className="input input-bordered"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 mt-2">
                                    {error}
                                </div>
                            )}
                            <div className="form-control mt-6">
                                <button className="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;