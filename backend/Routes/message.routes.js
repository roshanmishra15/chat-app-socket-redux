import express from "express";
import { getGlobalMessages, getPrivateMessages, getRecentMessages } from "../controllers/message.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/global", authMiddleware, getGlobalMessages);
router.get("/private/:receiverId", authMiddleware, getPrivateMessages);
router.get("/recent", authMiddleware, getRecentMessages);

export default router;
