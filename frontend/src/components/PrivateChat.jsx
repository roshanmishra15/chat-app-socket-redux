import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import axios from "axios";
import { setPrivateMessages } from "../redux/messageSlice";
import { getSocket } from "../socket/socket";

function PrivateChat() {
  const dispatch = useDispatch();

  const selectedUser = useSelector((state) => state.messages.selectedUser);
  const privateMessages = useSelector((state) => state.messages.privateMessages);

  const typingUsers = useSelector((state) => state.chat.typingUsers);
  const isTyping = selectedUser ? typingUsers[selectedUser._id] : false;

  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");

  // ✅ Fetch messages when selectedUser changes
  useEffect(() => {
    const fetchPrivateMessages = async () => {
      try {
        if (!selectedUser) return;

        const resp = await axios.get(
          `http://localhost:5000/api/messages/private/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(setPrivateMessages(resp.data));
      } catch (error) {
        console.log(
          "Error fetching private messages:",
          error.response?.data || error.message
        );
      }
    };

    if (token && selectedUser) fetchPrivateMessages();
  }, [selectedUser, dispatch, token]);

  // ✅ Mark messages as delivered + read (AFTER messages load)
  useEffect(() => {
    if (!selectedUser) return;
    if (privateMessages.length === 0) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("mark-as-delivered", { senderId: selectedUser._id });
    console.log("🔥 EMITTING MARK AS READ FOR:", selectedUser._id);
    socket.emit("mark-as-read", { senderId: selectedUser._id });
  }, [selectedUser, privateMessages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <h2 className="text-gray-500 font-medium">
          Select a user to start private chat 👤
        </h2>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Header */}
      <div className="h-16 border-b bg-white flex flex-col justify-center px-6 shadow-sm flex-shrink-0">
        <h2 className="font-semibold text-gray-800 text-lg">
          {selectedUser.fullname}
        </h2>

        {isTyping && (
          <p className="text-xs text-green-600 font-medium">typing...</p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {privateMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <p className="text-lg font-semibold">No chats yet 😅</p>
            <p className="text-sm mt-1">Say Hello 👋</p>
          </div>
        ) : (
          <Messages messages={privateMessages} />
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 py-3 shadow-inner flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
}

export default PrivateChat;
