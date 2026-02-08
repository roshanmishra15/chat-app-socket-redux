import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
function Register() {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    })
    const handleSubmit = async (e) => {
        e.preventDefault();

        // logic for submiting the data to the database

        if (!formData.fullname || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
            return toast.error("All fields Required")
        }
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Password And Confirm Password is Not Matching")
        }

        try {
            const resp = await axios.post("http://localhost:5000/api/auth/register", formData);
            toast.success("Registration successful");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something Went Wrong")
        }

    }
    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Create Account
                </h2>

                {/* Full Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullname}
                        name="fullname"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        name="email"
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Mobile */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Mobile Number
                    </label>
                    <input
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={formData.mobile}
                        name="mobile"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        name="password"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        name="confirmPassword"
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Register
                </button>
                <p className="text-sm text-center mt-4 text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Login
                    </Link>
                </p>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Register;
