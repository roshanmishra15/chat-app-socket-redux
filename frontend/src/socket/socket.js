import { io } from "socket.io-client";
import { store } from "../redux/store";
import { setOnlineUsers, clearOnlineUsers } from "../redux/onlineUsersSlice";

import {
  addGlobalMessage,
  addPrivateMessage,
  setGlobalMessages,
  setPrivateMessages,
} from "../redux/messageSlice";

import { setTypingUser, updateRecentChats } from "../redux/chatSlice";

let socket = null;

export const connectSocket = (token) => {
  if (!token) return;

  socket = io("http://localhost:5000", {
    auth: { token },
    autoConnect: false,
  });

  socket.connect();

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });

  // ✅ Online Users
  socket.on("online-users", (users) => {
    store.dispatch(setOnlineUsers(users));
  });

  // ✅ Global Chat
  socket.on("new-global-message", (msg) => {
    store.dispatch(addGlobalMessage(msg));
  });

  socket.on("global-messages", (messages) => {
    store.dispatch(setGlobalMessages(messages));
  });

  // ✅ Private Messages
  socket.on("new-private-message", (msg) => {
    store.dispatch(addPrivateMessage(msg));

    const myId = store.getState().auth.user?._id;
    if (!myId) return;

    const otherUser =
      msg.sender._id.toString() === myId.toString()
        ? msg.receiver
        : msg.sender;

    store.dispatch(
      updateRecentChats({
        user: otherUser,
        lastMessage: msg,
      })
    );
  });

  // ✅ Typing Indicator
  socket.on("user-typing", ({ senderId }) => {
    store.dispatch(setTypingUser({ userId: senderId, isTyping: true }));
  });

  socket.on("user-stop-typing", ({ senderId }) => {
    store.dispatch(setTypingUser({ userId: senderId, isTyping: false }));
  });

  // ✅ Delivered (✓✓)
  socket.on("messages-delivered", ({ receiverId }) => {
    const state = store.getState();
    const myId = state.auth.user?._id;

    if (!myId) return;

    const updated = state.messages.privateMessages.map((msg) => {
      const senderId = msg.sender?._id || msg.sender;
      const recId = msg.receiver?._id || msg.receiver;

      if (
        senderId?.toString() === myId.toString() &&
        recId?.toString() === receiverId.toString()
      ) {
        return { ...msg, delivered: true };
      }

      return msg;
    });

    store.dispatch(setPrivateMessages(updated));
  });

  // ✅ Read (Blue ✓✓)
  socket.on("messages-read", ({ messageIds }) => {
    const state = store.getState();

    const updated = state.messages.privateMessages.map((msg) => {
      if (messageIds.includes(msg._id)) {
        return { ...msg, read: true, delivered: true };
      }
      return msg;
    });

    store.dispatch(setPrivateMessages(updated));
  });



  socket.on("connect_error", (err) => {
    console.error("🔴 Socket connection error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    store.dispatch(clearOnlineUsers());
    console.log("🔴 Socket disconnected");
  }
};

export const getSocket = () => socket;
