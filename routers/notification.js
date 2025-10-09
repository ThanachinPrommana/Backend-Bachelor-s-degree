// routes/notification.js (ESM)
import express from "express";
const router = express.Router();

import { isAuthenticated } from "../Middlewares/authCheck.js";
import {
  getuserNotifications,
  removeNotification,
  removeNotiAll,
} from "../controllers/notification.js";

// แจ้งเตือนของผู้ใช้
router.get("/user/notification/:userId", isAuthenticated, getuserNotifications);
router.delete("/user/remove/noti/:notiId", isAuthenticated, removeNotification);
router.delete("/user/removeAll/noti", isAuthenticated, removeNotiAll);

export default router;
