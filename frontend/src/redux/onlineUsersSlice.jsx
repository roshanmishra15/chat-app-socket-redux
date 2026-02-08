import { createSlice } from "@reduxjs/toolkit";

const onlineUserSlice = createSlice({
    name: "onlineUsers",
    initialState: {
        users: []
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.users = action.payload;
        },
        clearOnlineUsers: (state) => {
            state.users = [];
        }
    }
})

export const { setOnlineUsers, clearOnlineUsers } = onlineUserSlice.actions;

export default onlineUserSlice.reducer;