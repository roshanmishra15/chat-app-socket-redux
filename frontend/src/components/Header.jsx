import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { disconnectSocket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="h-16 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 
                    text-white flex items-center justify-between px-6 shadow-lg">

      {/* Left Side */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center 
                          font-bold text-lg uppercase shadow">
            {user?.fullname?.[0] || "U"}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-700 rounded-full"></span>
        </div>

        <div>
          <h1 className="text-sm text-white/80">Welcome back</h1>
          <p className="text-lg font-semibold leading-4">
            {user ? user.fullname : "Guest"}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg 
                     font-medium transition shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
