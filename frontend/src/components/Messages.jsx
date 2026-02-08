import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function Messages({ messages = [] }) {
  const currentUser = useSelector((state) => state.auth.user);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const myId = currentUser?._id || currentUser?.userId || currentUser?.id;

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const senderId = msg.sender?._id || msg.sender;

        const isSelf = senderId?.toString() === myId?.toString();

        return (
          <div
            key={msg._id}
            className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md px-4 py-3 rounded-2xl text-sm shadow-sm transition 
              ${
                isSelf
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
              }`}
            >
              {!isSelf && (
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  {msg.sender?.fullname || "User"}
                </p>
              )}

              <p className="leading-relaxed">{msg.content}</p>

              {/* Time + Tick */}
              <div
                className={`flex items-center justify-end gap-2 mt-2 text-[10px]
                ${isSelf ? "text-white/70" : "text-gray-400"}`}
              >
                <span>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* Tick only for my messages */}
                {isSelf && (
                  <span className="font-bold">
                    {!msg.delivered && !msg.read && "✓"}
                    {msg.delivered && !msg.read && "✓✓"}
                    {msg.read && <span className="text-sky-300">✓✓</span>}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default Messages;
