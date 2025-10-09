// routes/user.js (ESM, merged & fixed)
import express from "express";
import upload from "../Middlewares/upload.js"; // profile image uploader
import { uploadDocument } from "../Middlewares/document.js"; // ✅ named import ตาม middleware ปัจจุบัน
import { isAuthenticated, isSeller } from "../Middlewares/authCheck.js";

import {
  // Admin / Management
  updateStatusSeller,
  deleteUser,

  // Lists / Search
  listUserSeller,
  listUserBuyer,
  searchFiltersSeller,

  // Profiles (read)
  getUserProfile,
  getSellerProfile,

  // Profiles (self update)
  updateUser,
  updateSeller,
  updateimage,

  // Seller posts management (self)
  getpostBySeller,
  deletePostBySeller,

  // Deposits
  createdeposite,
  getdeposits,
  updateDepositStatus,

  // Documents
  useruploadDocument,

  // Booking & Slots (บางตัวอยู่ใน controllers/user ของคุณ)
  createBooking,
  createDateTimeSlot,
  removeTimeSlot,
  removeBooking,
  uploadFinalSlip,
  confirmedSlipBySeller,
  searchFilterDateTimeSlot,
} from "../controllers/user.js";

import {
  createStripePaymentIntent,
  // ถ้าต้องใช้ webhook ให้ไปประกาศใน server ระดับแอป (raw body) ตามที่คุยกัน
  // handleStripeWebhook
} from "../controllers/payment.js";

const router = express.Router();

/* -------------------------------------------------------------
 * Admin / Management
 * ----------------------------------------------------------- */

// อัปเดตสถานะผู้ขาย (APPROVED/REJECTED/PENDING)
router.patch("/seller/:sellerId/status", isAuthenticated, updateStatusSeller);

// Back-compat (เดิมเคยใช้ /seller/status/:id)
router.patch("/seller/status/:id", isAuthenticated, (req, res, next) => {
  req.params.sellerId = req.params.id;
  return updateStatusSeller(req, res, next);
});

// ลบผู้ใช้
router.delete("/user/:id", isAuthenticated, deleteUser);

// Back-compat (บางที่เคยเรียก /seller/:id เพื่อลบ user)
router.delete("/seller/:id", isAuthenticated, deleteUser);

/* -------------------------------------------------------------
 * Lists / Search
 * ----------------------------------------------------------- */

// รายชื่อผู้ขาย/ผู้ซื้อทั้งหมด (หน้า Admin/Backoffice)
router.get("/userSeller", listUserSeller);
router.get("/userBuyer", listUserBuyer);

// ค้นหาโพสต์ของผู้ขาย (เฉพาะของตัวเอง)
router.get("/search/post/seller", isAuthenticated, searchFiltersSeller);

// Back-compat (เดิมเคยส่งเป็น POST)
router.post("/search/filters/seller", isAuthenticated, searchFiltersSeller);

/* -------------------------------------------------------------
 * Profiles (read-only by id)
 * ----------------------------------------------------------- */

// โปรไฟล์ Seller ตาม id (อ่านอย่างเดียว)
router.get("/profileseller/:id", getSellerProfile);
// Back-compat alias
router.get("/seller/profile/:id", getSellerProfile);

// โปรไฟล์ User/Buyer ตาม id (อ่านอย่างเดียว)
router.get("/profile/:id", getUserProfile);

/* -------------------------------------------------------------
 * Profiles (self update)
 * ----------------------------------------------------------- */

// อัปเดตโปรไฟล์ผู้ใช้/ผู้ซื้อ (User + Buyer)
router.patch("/profile", isAuthenticated, updateUser);

// อัปเดตแบบรวม (User + Buyer + Seller) — ใช้เฉพาะผู้ที่เป็น Seller
router.patch("/profileseller", isAuthenticated, updateSeller);
// Back-compat alias
router.patch("/seller/profile", isAuthenticated, updateSeller);

// อัปเดตรูปโปรไฟล์
router.post("/image", isAuthenticated, upload.single("image"), updateimage);

/* -------------------------------------------------------------
 * Seller posts management (self)
 * ----------------------------------------------------------- */

// ดึงโพสต์ของผู้ขาย (current user)
router.get("/post/seller", isAuthenticated, getpostBySeller);

// Back-compat (เดิมเคยใช้ /seller/posts/:id)
router.get("/seller/posts/:id", isAuthenticated, getpostBySeller);

// ลบโพสต์ของผู้ขาย (เจ้าของเท่านั้น)
router.delete(
  "/seller/remove/post/:postId",
  isAuthenticated,
  deletePostBySeller
);

// Back-compat (เดิมเคยส่ง :id)
router.delete("/seller/post/:id", isAuthenticated, (req, res, next) => {
  req.params.postId = req.params.id;
  return deletePostBySeller(req, res, next);
});

/* -------------------------------------------------------------
 * Deposits
 * ----------------------------------------------------------- */

// ผู้ใช้สร้างมัดจำ (ใช้เอกสารที่อนุมัติแล้ว)
router.post("/user/create/deposit", isAuthenticated, createdeposite);

// ดูมัดจำของตัวเอง
router.get("/deposit", isAuthenticated, getdeposits);

// ผู้ขายอัปเดตสถานะมัดจำ (CONFIRMED/REJECTED)
router.patch(
  "/update/status/deposit/:depositId",
  isAuthenticated,
  updateDepositStatus
);

/* -------------------------------------------------------------
 * Documents
 * ----------------------------------------------------------- */

// อัปโหลดเอกสาร
router.post(
  "/document",
  isAuthenticated,
  uploadDocument.single("document"),
  useruploadDocument
);

/* -------------------------------------------------------------
 * DateTime Slots & Booking
 * ----------------------------------------------------------- */

// ผู้ขายสร้างช่วงเวลาให้โพสต์
router.post("/seller/slot", isAuthenticated, isSeller, createDateTimeSlot);

// ผู้ขายลบช่วงเวลา
router.delete("/seller/remove/:timeSlotId", isAuthenticated, removeTimeSlot);

// ผู้ขายค้นหา/กรองช่วงเวลา
router.post("/search/slot/seller", isAuthenticated, searchFilterDateTimeSlot);

// ผู้ใช้จองนัดหมาย (เลือก slot + unit)
router.post("/user/booking", isAuthenticated, createBooking);

// ผู้ใช้/ผู้ขายยกเลิกการจองของตัวเอง
router.delete("/user/remove/:bookingId", isAuthenticated, removeBooking);

// ผู้ซื้ออัปโหลดสลิปจ่ายงวดสุดท้าย
router.post(
  "/upload-final-slip/:bookingId",
  isAuthenticated,
  upload.single("finalSlip"),
  uploadFinalSlip
);

// ผู้ขายยืนยันสลิปงวดสุดท้าย (ปิดการขายยูนิต)
router.post(
  "/confirmed-slip/:bookingId",
  isAuthenticated,
  confirmedSlipBySeller
);

/* -------------------------------------------------------------
 * Stripe Payments
 * ----------------------------------------------------------- */

// สร้าง PaymentIntent
router.post("/create/payment", isAuthenticated, createStripePaymentIntent);

// ⚠️ ถ้าต้องใช้ Webhook ให้เอาไปประกาศใน server ระดับแอป “ก่อน” express.json()

export default router;
