// routes/datetimeslot.js (ESM, expanded)
import express from "express";
const router = express.Router();

import { isAuthenticated, isSeller } from "../Middlewares/authCheck.js";
import {
  createDateTimeSlot,
  removeBooking,
  confirmedSlipBySeller,
  searchFilterDateTimeSlot,
  getAvailableSlotsForPost, // ที่คุณเพิ่มมาเอง
} from "../controllers/datetimeslot.js";

// Seller สร้าง slot สำหรับโพสต์ของตน
router.post("/seller/slot", isAuthenticated, isSeller, createDateTimeSlot);

// ลบ booking ของตนเอง
router.delete("/user/remove/:bookingId", isAuthenticated, removeBooking);

// ผู้ขายยืนยันสลิปของลูกค้า
router.post(
  "/confirmed-slip/:bookingId",
  isAuthenticated,
  confirmedSlipBySeller
);

// ค้นหา slot ของผู้ขาย
router.post("/search/slot/seller", isAuthenticated, searchFilterDateTimeSlot);

// ดู slot ว่างของโพสต์ (public/หรือจะบังคับ login ก็ได้)
router.get("/list/slots/:postId", getAvailableSlotsForPost);

export default router;
