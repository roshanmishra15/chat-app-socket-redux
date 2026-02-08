import React, { useEffect, useRef, useState } from "react";
import { getSocket } from "../socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { updateRecentChats } from "../redux/chatSlice";
import EmojiPicker from "emoji-picker-react";

function MessageInput() {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const emojiRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const mode = useSelector((state) => state.chat.mode);
  const selectedUser = useSelector((state) => state.messages.selectedUser);

  const dispatch = useDispatch();

  // ✅ Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ When user selects emoji
  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  // ✅ Typing event
  const handleTyping = (value) => {
    setText(value);

    const socket = getSocket();
    if (!socket) return;

    if (mode === "private" && selectedUser) {
      socket.emit("typing", { receiverId: selectedUser._id });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", { receiverId: selectedUser._id });
      }, 1000);
    }
  };

  // ✅ Send message
  const handleSend = () => {
    if (!text.trim()) return;

    const socket = getSocket();
    if (!socket) return;

    if (mode === "private") {
      if (!selectedUser) {
        alert("Select a user first");
        return;
      }

      const newMsg = {
        content: text,
        createdAt: new Date().toISOString(),
      };

      socket.emit("send-private-message", {
        receiverId: selectedUser._id,
        content: text,
      });

      dispatch(
        updateRecentChats({
          user: selectedUser,
          lastMessage: newMsg,
        })
      );

      socket.emit("stop-typing", { receiverId: selectedUser._id });
    } else {
      socket.emit("send-global-message", { content: text });
    }

    setText("");
    setShowEmoji(false); // ✅ close emoji picker after sending
  };

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-3 relative">

      {/* ✅ Emoji Button + Picker */}
      <div className="relative" ref={emojiRef}>
        <button
          onClick={() => setShowEmoji((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          😊
        </button>

        {showEmoji && (
          <div className="absolute bottom-14 left-0 z-50 shadow-lg">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Attachment Button */}
      <button className="p-2 rounded-full hover:bg-gray-100 transition">
        📎
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => handleTyping(e.target.value)}
        className="flex-1 px-4 py-2 rounded-full bg-gray-100 border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 
                   text-white px-5 py-2 rounded-full font-medium shadow-md
                   hover:opacity-90 transition"
      >
        🚀 Send
      </button>
    </div>
  );
}

export default MessageInput;
