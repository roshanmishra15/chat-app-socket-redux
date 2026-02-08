import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import onlineUsersReducer from "./onlineUsersSlice";
import messageReducer from './messageSlice'
import chatReducer from './chatSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    onlineUsers: onlineUsersReducer,
    messages: messageReducer,
    chat : chatReducer,
  },
});
