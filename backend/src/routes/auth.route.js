import express from "express";
import { signup, login, logout, onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes (require valid JWT cookie via protectRoute middleware)
router.post("/onboarding", protectRoute, onboard);

// Session check endpoint: returns currently authenticated user on frontend page load
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router;
