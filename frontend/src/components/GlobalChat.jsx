import React, { useEffect } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalMessages } from "../redux/messageSlice";

function GlobalChat() {
  const dispatch = useDispatch();
  const globalMessages = useSelector((state) => state.messages.globalMessages);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const resp = await axios.get("http://localhost:5000/api/messages/global", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setGlobalMessages(resp.data));
      } catch (error) {
        console.log("Error fetching global messages", error.message);
      }
    };

    fetchMessages();
  }, [dispatch]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Header */}
      <div className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 
                       text-white flex items-center justify-center font-bold text-lg shadow"
          >
            G
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 text-lg">Global Chat</h2>
            <p className="text-xs text-gray-500">Everyone is here 🌍</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            📞
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            ⚙️
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <Messages messages={globalMessages} />
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 py-3 shadow-inner flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
}

export default GlobalChat;
