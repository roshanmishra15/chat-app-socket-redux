import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadProfilePic } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/upload-profile", authMiddleware, upload.single("file"), uploadProfilePic);

export default router;
