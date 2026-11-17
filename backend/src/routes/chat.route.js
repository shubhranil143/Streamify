import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

// GET /api/chat/token - Protected route: mints a Stream user token for the authenticated user
router.get("/token", protectRoute, getStreamToken);

export default router;