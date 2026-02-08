import { createSlice } from "@reduxjs/toolkit";

const tokenFromStorage = localStorage.getItem("token");

const initialState = {
  token: tokenFromStorage || null,
  isAuthenticated: !!tokenFromStorage,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    restoreAuth: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    // ✅ ADD THIS
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, restoreAuth, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
