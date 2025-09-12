// routes/notification.js
const express = require("express");
const router = express.Router();

const {
  getuserNotifications,
  removeNotification,
  removeNotiAll,
  markAsRead,
} = require("../controllers/notification");

const { isAuthenticated } = require("../middlewares/authCheck");

// ดึงแจ้งเตือนของ user (ต้องเป็นเจ้าของเท่านั้น)
router.get("/user/notification/:userId", isAuthenticated, getuserNotifications);

// ทำเครื่องหมายว่าอ่านแล้ว
router.patch("/user/notification/:notiId/read", isAuthenticated, markAsRead);

// ลบแจ้งเตือน 1 อัน (ต้องเป็นของตัวเอง)
router.delete("/user/remove/noti/:notiId", isAuthenticated, removeNotification);

// ลบแจ้งเตือนทั้งหมดของ user ที่ล็อกอิน
router.delete("/user/removeAll/noti", isAuthenticated, removeNotiAll);

module.exports = router;
