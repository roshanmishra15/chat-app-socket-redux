import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { restoreAuth, setUser, logout } from "./redux/authSlice.jsx";

import { getMeApi } from "./api/authApi.js";
import { connectSocket } from "./socket/socket.js";

function App() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localToken = localStorage.getItem("token");

        if (localToken && !user) {
          // restore token in redux
          dispatch(restoreAuth(localToken));

          // fetch user from backend
          const userData = await getMeApi(localToken);

          // set user in redux
          dispatch(setUser(userData));

          // reconnect socket
          connectSocket(localToken);
        }
      } catch (error) {
        console.log("Refresh auth error:", error.message);

        dispatch(logout());
      }
    };

    fetchUser();
  }, [dispatch, user]);

  return (
    <div>
      <Routes>
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
