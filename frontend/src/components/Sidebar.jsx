import React, { useEffect, useState } from "react";
import OnlineUsers from "./OnlineUsers.jsx";
import RecentChats from "./RecentChats.jsx";
import ProfileUpload from "./ProfileUpload.jsx"; // ✅ added
import { useDispatch, useSelector } from "react-redux";
import { setMode, setRecentChats } from "../redux/chatSlice.jsx";
import axios from "axios";

function Sidebar() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.chat.mode);

  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/messages/recent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(setRecentChats(res.data));
      } catch (error) {
        console.log("Error fetching recent chats:", error);
      }
    };

    if (token) fetchRecentChats();
  }, [token, dispatch]);

  return (
    <div className="w-72 bg-white border-r flex flex-col shadow-sm">
      
      {/* ✅ Profile Upload Section */}
      <div className="p-4 border-b">
        <ProfileUpload />
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full px-3 py-2 rounded-lg border 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Chat Mode Buttons */}
      <div className="px-4 space-y-3">
        <button
          onClick={() => dispatch(setMode("global"))}
          className={`w-full flex items-center gap-2 justify-center 
                     py-2 rounded-xl shadow-md transition font-medium
                     ${
                       mode === "global"
                         ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     }`}
        >
          🌍 Global Chat
        </button>

        <button
          onClick={() => dispatch(setMode("private"))}
          className={`w-full flex items-center gap-2 justify-center 
                     py-2 rounded-xl shadow-md transition font-medium
                     ${
                       mode === "private"
                         ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     }`}
        >
          👤 Private Chat
        </button>
      </div>

      {/* Recent Chats */}
      <div className="px-4 mt-6">
        <RecentChats search={search} />
      </div>

      {/* Online Users */}
      <div className="flex-1 overflow-y-auto p-4 mt-4">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">
          Online Users
        </h2>

        <OnlineUsers search={search} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-gray-500 text-center">
        Roshan Mishra⚡
      </div>
    </div>
  );
}

export default Sidebar;
