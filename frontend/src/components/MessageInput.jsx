import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getSocket } from "../socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { updateRecentChats } from "../redux/chatSlice";
import EmojiPicker from "emoji-picker-react";

function MessageInput() {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");

  const emojiRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileRef = useRef(null);

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

  // ✅ Emoji select handler
  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  // ✅ Open file picker
  const handleFileClick = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
  };

  // ✅ File upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (mode === "private" && !selectedUser) {
      alert("Select a user first");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { url, fileType, fileName } = res.data;

      const socket = getSocket();
      if (!socket) return;

      // ✅ Send file as message
      socket.emit("send-private-message", {
        receiverId: selectedUser._id,
        content: url,
        messageType: "file",
        fileType,
        fileName,
      });

      // ✅ Update RecentChats preview
      dispatch(
        updateRecentChats({
          user: selectedUser,
          lastMessage: {
            content: fileName,
            createdAt: new Date().toISOString(),
          },
        })
      );
    } catch (error) {
      console.log("File upload error:", error.response?.data || error.message);
      alert("File upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ✅ Typing event handler
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

  // ✅ Send text message
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
        messageType: "text",
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
    setShowEmoji(false);
  };

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-3 relative">
      {/* ✅ Emoji Button + Picker */}
      <div className="relative" ref={emojiRef}>
        <button
          disabled={uploading}
          onClick={() => setShowEmoji((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
        >
          😊
        </button>

        {showEmoji && (
          <div className="absolute bottom-14 left-0 z-50 shadow-lg">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* 📎 Attachment Button */}
      <button
        disabled={uploading}
        onClick={handleFileClick}
        className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
      >
        📎
      </button>

      {/* Hidden File Input */}
      <input type="file" ref={fileRef} hidden onChange={handleFileChange} />

      {/* Input */}
      <input
        type="text"
        placeholder={uploading ? "Uploading file..." : "Type a message..."}
        value={text}
        onChange={(e) => handleTyping(e.target.value)}
        disabled={uploading}
        className="flex-1 px-4 py-2 rounded-full bg-gray-100 border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:opacity-50"
      />

      {/* Send Button */}
      <button
        disabled={uploading}
        onClick={handleSend}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 
                   text-white px-5 py-2 rounded-full font-medium shadow-md
                   hover:opacity-90 transition disabled:opacity-50"
      >
        {uploading ? "⏳" : "🚀 Send"}
      </button>
    </div>
  );
}

export default MessageInput;
