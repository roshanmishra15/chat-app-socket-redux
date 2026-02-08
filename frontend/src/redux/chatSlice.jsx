import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        mode: "global",
        recentChats: [],
        typingUsers: {},
    },
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload;
        },

        setRecentChats: (state, action) => {
            state.recentChats = action.payload;
        },
        setTypingUser: (state, action) => {
            const { userId, isTyping } = action.payload;
            state.typingUsers[userId] = isTyping;
        },


        updateRecentChats: (state, action) => {
            const { user, lastMessage } = action.payload;

            // remove old chat if exists
            state.recentChats = state.recentChats.filter(
                (chat) => chat.user._id !== user._id
            );

            // add new chat at top
            state.recentChats.unshift({ user, lastMessage });
        },
    },
});

export const { setMode, setRecentChats, updateRecentChats,setTypingUser } = chatSlice.actions;

export default chatSlice.reducer;
