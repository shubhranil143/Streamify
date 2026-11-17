import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
} from "../controllers/user.controller.js";

const router = express.Router();

// Apply protectRoute middleware globally across all user routes below
router.use(protectRoute);

// User discovery and friends list
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

// Friend request actions
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

// Notification and request status queries
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;
