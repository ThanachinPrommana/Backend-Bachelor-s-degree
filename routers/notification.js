// routes/notification.js (ESM)

import express from "express";
import {
  getuserNotifications,
  removeNotification,
  removeNotiAll,
  markAsRead,          // ✅ เพิ่ม
} from "../controllers/notification.js";
import { isAuthenticated } from "../Middlewares/authCheck.js";

const router = express.Router();

// Get notifications for a user (userId เป็น optional)
router.get("/user/notification/:userId?", isAuthenticated, getuserNotifications);

// Mark single notification as read
router.patch("/user/notification/:notiId/read", isAuthenticated, markAsRead);

// Remove single notification
router.delete("/user/remove/noti/:notiId", isAuthenticated, removeNotification);

// Remove all notifications of current user
router.delete("/user/removeAll/noti", isAuthenticated, removeNotiAll);

export default router;
