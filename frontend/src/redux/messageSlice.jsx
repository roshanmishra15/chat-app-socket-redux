import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    globalMessages: [],
    privateMessages: [],
    selectedUser: null,   // jis user pe click kiya
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },

        setGlobalMessages: (state, action) => {
            state.globalMessages = action.payload;
        },

        addGlobalMessage: (state, action) => {
            state.globalMessages.push(action.payload);
        },

        setPrivateMessages: (state, action) => {
            state.privateMessages = action.payload;
        },

        addPrivateMessage: (state, action) => {
            state.privateMessages.push(action.payload);
        },

        clearMessages: (state) => {
            state.globalMessages = [];
            state.privateMessages = [];
            state.selectedUser = null;
        },
    },
});

export const {
    setSelectedUser,
    setGlobalMessages,
    addGlobalMessage,
    setPrivateMessages,
    addPrivateMessage,
    clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
