import express from "express";
import { getuserNotifications, removeNotification, removeNotiAll } from "../controllers/notification.js";
import { isAuthenticated } from "../Middlewares/authCheck.js";
const router = express.Router();

router.get("/user/notification/:userId", getuserNotifications)
router.delete("/user/remove/noti/:notiId", isAuthenticated, removeNotification)
router.delete("/user/removeAll/noti", removeNotiAll)

export default router;