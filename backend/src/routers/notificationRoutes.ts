import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Get all notifications
router.get("/", protect, getNotifications);

// Get unread notification count
router.get("/unread-count", protect, getUnreadCount);

// Mark one notification as read
router.patch("/:id/read", protect, markAsRead);

// Mark all notifications as read
router.patch("/read-all", protect, markAllAsRead);

export default router;