import { authMiddleware } from '../middlewares/auth.middleware.js'
import { uploadFile } from '../controllers/upload.controller.js'
import { upload } from '../middlewares/upload.middleware.js'
import express from 'express'

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), uploadFile);

export default router;