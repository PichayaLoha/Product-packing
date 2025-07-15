import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../auth/AuthContext";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [role, setRole] = useState('packer');
    const [error, setError] = useState('');

    const authContext = useContext(AuthContext);
    if (!authContext) return <p>Loading...</p>;

    const { setToken, setUserId } = authContext;

    const validateForm = () => {
        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (role === "admin") {
            const confirmDelete = window.confirm("Are you sure you want to register as admin?");
            if (confirmDelete) {
                if (!validateForm()) return;

                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            user_name: username,
                            user_password: password,
                            user_first_name: firstname,
                            user_last_name: lastname,
                            user_role: role
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setUserId(data.user_id);
                        setToken(data.token, 120);
                        alert("Register successfully!");
                        navigate("/");
                    } else {
                        setError(data.error || "Cannot register user.");
                    }
                } catch (error) {
                    setError("There was an error. Please try again.");
                }
            }
        }
        else {
            if (!validateForm()) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_name: username,
                        user_password: password,
                        user_first_name: firstname,
                        user_last_name: lastname,
                        user_role: role
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setUserId(data.user_id);
                    setToken(data.token, 120);
                    alert("Register successfully!");
                    navigate("/");
                } else {
                    setError(data.error || "Cannot register user.");
                }
            } catch (error) {
                setError("There was an error. Please try again.");
            }
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
                        <h2 className="text-white text-xl font-medium text-center">Register</h2>
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

                        <div className="mb-4">
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

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="input input-bordered w-full"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">First Name</label>
                            <input
                                type="text"
                                placeholder="Enter first name"
                                className="input input-bordered w-full"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter last name"
                                className="input input-bordered w-full"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium">Role</label>
                            <select
                                className="select select-bordered w-full"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="packer">Packer</option>
                                <option value="inventory manager">Inventory manager</option>
                                <option value="admin" className='text-orange-500'>!Admin</option>
                            </select>
                        </div>

                        {error && <p className="text-red-600 mb-4">{error}</p>}

                        <button type="submit" className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full mb-4">
                            Register
                        </button>

                        <div className="text-center">
                            <span className="text-gray-600">Already have an account? </span>
                            <a
                                className="text-indigo-600 hover:underline cursor-pointer"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;