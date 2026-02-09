import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/messageSlice";
import { setMode } from "../redux/chatSlice";

const RecentChats = ({ search }) => {
  const dispatch = useDispatch();

  const recentChats = useSelector((state) => state.chat.recentChats);
  const onlineUsers = useSelector((state) => state.onlineUsers.users || []);

  const filteredChats = recentChats.filter((chat) =>
    chat.user.fullname.toLowerCase().includes(search.toLowerCase())
  );

  const isOnline = (userId) => {
    return onlineUsers.some((u) => u._id === userId);
  };

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage) return "";

    if (lastMessage.messageType === "file") {
      if (lastMessage.fileType?.includes("image")) return "🖼️ Photo";
      if (lastMessage.fileType?.includes("pdf")) return "📄 PDF File";
      if (lastMessage.fileType?.includes("word")) return "📑 Word File";

      return `📎 ${lastMessage.fileName || "Attachment"}`;
    }

    return lastMessage.content;
  };

  return (
    <div className="mt-6">
      <h2 className="text-gray-500 text-sm font-semibold px-3 mb-3">
        Recent Chats
      </h2>

      <div className="flex flex-col gap-2">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.user._id}
              onClick={() => {
                dispatch(setSelectedUser(chat.user));
                dispatch(setMode("private"));
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 cursor-pointer transition"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {chat.user.fullname?.charAt(0).toUpperCase()}
                </div>

                {/* Online Dot */}
                {isOnline(chat.user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* Name + Last Message */}
              <div className="flex-1 overflow-hidden">
                <p className="text-gray-800 font-semibold text-sm">
                  {chat.user.fullname}
                </p>

                <p className="text-gray-500 text-xs truncate">
                  {getLastMessagePreview(chat.lastMessage)}
                </p>
              </div>

              {/* Time */}
              <div className="text-gray-400 text-xs whitespace-nowrap">
                {chat.lastMessage?.createdAt
                  ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-xs px-3">No recent chats</p>
        )}
      </div>
    </div>
  );
};

export default RecentChats;
