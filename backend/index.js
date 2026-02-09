import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDb from "./config/db.js";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from './Routes/message.routes.js'
import initSocket from "./socket/index.js";
import uploadRoute from './Routes/upload.routes.js'

dotenv.config();

const app = express();

/* ================== MIDDLEWARES ================== */
app.use(cors());
app.use(express.json());

/* ================== DATABASE ================== */
connectDb();

/* ================== HTTP SERVER ================== */
const server = http.createServer(app);

/* ================== SOCKET.IO ================== */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use("/uploads", express.static("uploads"));
/* ================== ROUTES ================== */
app.get("/", (req, res) => {
  res.send("Hello Roshan");
});
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/messages", messageRoutes);

/* ================== SOCKET INIT ================== */
initSocket(io);

/* ================== SERVER LISTEN ================== */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ================== EXPORT ================== */
export { io };
