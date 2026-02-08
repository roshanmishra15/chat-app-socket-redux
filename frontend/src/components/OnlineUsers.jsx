import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../redux/chatSlice";
import { setSelectedUser } from "../redux/messageSlice";

function OnlineUsers() {
  const users = useSelector((state) => state.onlineUsers.users);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const filteredUsers = users.filter((u) => u._id !== currentUser?.id);

  const handleUser = (user) => {
    console.log("Selected User:", user);
    dispatch(setSelectedUser(user));
    dispatch(setMode("private"));
  };

  return (
    <div className="space-y-2">
      {filteredUsers.length === 0 ? (
        <p className="text-sm text-gray-500 text-center mt-4">
          No users online 😴
        </p>
      ) : (
        filteredUsers.map((u) => (
          <div
            key={u._id}
            onClick={() => handleUser(u)}
            className="flex items-center gap-3 p-3 rounded-xl 
                       hover:bg-blue-50 cursor-pointer transition 
                       border border-transparent hover:border-blue-200"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 
                              text-white flex items-center justify-center font-bold text-lg shadow">
                {u.fullname?.[0]?.toUpperCase()}
              </div>

              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
                               border-2 border-white rounded-full"></span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">{u.fullname}</span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OnlineUsers;
