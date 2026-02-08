import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link,  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSuccess } from "../redux/authSlice";
import { connectSocket } from "../socket/socket";
import { setOnlineUsers } from "../redux/onlineUsersSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("inside ")
            const resp = await axios.post("http://localhost:5000/api/auth/login", formData);
            toast.success(resp.data.message)

            let token = resp.data.token;
            let user = resp.data.user;
            console.log(user);

            localStorage.setItem("token", token);
            dispatch(loginSuccess({ token, user, }))
            connectSocket(token);
            navigate("/", { replace: true })

        }
        catch (error) {
            console.log(error)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Login to your account
                </h2>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-5">
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
                >
                    Login
                </button>

                {/* Footer */}
                <p className="text-sm text-center mt-4 text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
