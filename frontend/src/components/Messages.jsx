import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function Messages({ messages = [] }) {
  const currentUser = useSelector((state) => state.auth.user);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const myId = currentUser?._id || currentUser?.userId || currentUser?.id;

  const renderMessageContent = (msg) => {
    // ✅ TEXT MESSAGE
    if (!msg.messageType || msg.messageType === "text") {
      return <p className="leading-relaxed">{msg.content}</p>;
    }

    // ✅ FILE MESSAGE
    if (msg.messageType === "file") {
      const fileType = msg.fileType || "";

      // ✅ IMAGE PREVIEW
      if (fileType.startsWith("image/")) {
        return (
          <div className="mt-2">
            <img
              src={msg.content}
              alt="uploaded"
              className="w-60 rounded-xl border shadow-sm"
            />
            <a
              href={msg.content}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline mt-2 block"
            >
              View Full Image
            </a>
          </div>
        );
      }

      // ✅ PDF / DOC / ZIP / OTHER FILES
      return (
        <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl mt-2">
          <div className="text-2xl">📄</div>

          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-800">
              {msg.fileName || "File"}
            </p>
            <p className="text-xs text-gray-500">{msg.fileType}</p>

            <a
              href={msg.content}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 font-semibold mt-1 underline"
            >
              Download
            </a>
          </div>
        </div>
      );
    }

    return <p>{msg.content}</p>;
  };

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

              {/* ✅ Render Text or File */}
              {renderMessageContent(msg)}

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
