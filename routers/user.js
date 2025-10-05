// routes/user.merged.js (ESM, merged & normalized)
import express from "express";
import upload from "../Middlewares/upload.js";              // images / generic single-file
import uploadDocument from "../Middlewares/document.js";    // user documents
import { isAuthenticated, isSeller } from "../Middlewares/authCheck.js";

const router = express.Router();

// Controllers
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

  // Booking & Slots
  createBooking,
  createDateTimeSlot,
  removeTimeSlot,
  removeBooking,
  uploadFinalSlip,
  confirmedSlipBySeller,
  searchFilterDateTimeSlot,
} from "../controllers/user.js";

import { createStripePaymentIntent /*, handleStripeWebhook*/ } from "../controllers/payment.js";

/* -------------------------------------------------------------
 * Admin / Management (ควรมี adminOnly ถ้ามี middleware)
 * ----------------------------------------------------------- */

// Update Seller status (APPROVED/REJECTED/PENDING)
router.patch("/seller/:sellerId/status", isAuthenticated, updateStatusSeller);

// Back-compat alias (old route): /seller/status/:id  → map :id → :sellerId
router.patch("/seller/status/:id", isAuthenticated, (req, res, next) => {
  req.params.sellerId = req.params.id;
  return updateStatusSeller(req, res, next);
});

// Delete user
router.delete("/user/:id", isAuthenticated, deleteUser);
// Back-compat alias (old, ใช้ path ว่า /seller/:id แต่ลบ user) — คงไว้เผื่อ FE เก่า
router.delete("/seller/:id", isAuthenticated, deleteUser);

/* -------------------------------------------------------------
 * Lists / Search
 * ----------------------------------------------------------- */

// รายชื่อผู้ขาย/ผู้ซื้อ
router.get("/userSeller", listUserSeller);
router.get("/userBuyer", listUserBuyer);

// ค้นหา “โพสต์ของผู้ขาย (เฉพาะของตัวเอง)”
router.get("/search/post/seller", isAuthenticated, searchFiltersSeller);

// Back-compat alias (เดิมเคยยิงเป็น POST)
router.post("/search/filters/seller", isAuthenticated, searchFiltersSeller);

/* -------------------------------------------------------------
 * Profiles (read-only by id)
 * ----------------------------------------------------------- */

router.get("/profileseller/:id", getSellerProfile);     // alias เดิม
router.get("/seller/profile/:id", getSellerProfile);    // back-compat ชื่อ path อื่น
router.get("/profile/:id", getUserProfile);             // โปรไฟล์ Buyer ตาม id

/* -------------------------------------------------------------
 * Profiles (self update)
 * ----------------------------------------------------------- */

// อัปเดตโปรไฟล์ “เฉพาะผู้ใช้/ผู้ซื้อ” (User + Buyer)
router.patch("/profile", isAuthenticated, updateUser);

// อัปเดตแบบรวม (User + Buyer + Seller) — เฉพาะ Seller
router.patch("/profileseller", isAuthenticated, updateSeller);
router.patch("/seller/profile", isAuthenticated, updateSeller); // back-compat

// อัปเดตรูปโปรไฟล์
router.post("/image", isAuthenticated, upload.single("image"), updateimage);

/* -------------------------------------------------------------
 * Seller posts management (self)
 * ----------------------------------------------------------- */

// ดูโพสต์ของผู้ขาย (ของตัวเอง)
router.get("/post/seller", isAuthenticated, getpostBySeller);
// Back-compat alias (บางที่อาจเรียกด้วย path เก่า)
router.get("/seller/posts/:id", isAuthenticated, getpostBySeller);

// ลบโพสต์ของผู้ขาย (ของตัวเอง)
router.delete("/seller/remove/post/:postId", isAuthenticated, deletePostBySeller);
// Back-compat alias: /seller/post/:id → map :id → :postId
router.delete("/seller/post/:id", isAuthenticated, (req, res, next) => {
  req.params.postId = req.params.id;
  return deletePostBySeller(req, res, next);
});

/* -------------------------------------------------------------
 * Deposits
 * ----------------------------------------------------------- */

// สร้างมัดจำ
router.post("/user/create/deposit", isAuthenticated, createdeposite);

// ดูรายการมัดจำของผู้ใช้ปัจจุบัน (ใช้ session)
router.get("/deposit", isAuthenticated, getdeposits);

// ผู้ขายอัปเดตสถานะมัดจำ (CONFIRMED/REJECTED)
router.patch("/update/status/deposit/:depositId", isAuthenticated, updateDepositStatus);

/* -------------------------------------------------------------
 * Documents
 * ----------------------------------------------------------- */

router.post(
  "/document",
  isAuthenticated,
  uploadDocument.single("document"),
  useruploadDocument
);

/* -------------------------------------------------------------
 * DateTime Slots & Booking
 * ----------------------------------------------------------- */

// Seller: สร้างช่วงเวลาให้โพสต์
router.post("/seller/slot", isAuthenticated, isSeller, createDateTimeSlot);

// Seller: ลบช่วงเวลา (ลบ booking ที่เกี่ยวข้องอัตโนมัติ)
router.delete("/seller/remove/:timeSlotId", isAuthenticated, removeTimeSlot);

// Seller: ค้นหา slot ของตัวเอง (มี filter)
router.post("/search/slot/seller", isAuthenticated, searchFilterDateTimeSlot);

// Buyer/Seller: สร้าง/ลบ booking
router.post("/user/booking", isAuthenticated, createBooking);
router.delete("/user/remove/:bookingId", isAuthenticated, removeBooking);

// Buyer: อัปโหลดสลิปจ่ายส่วนที่เหลือ
router.post(
  "/upload-final-slip/:bookingId",
  isAuthenticated,
  upload.single("finalSlip"),
  uploadFinalSlip
);

// Seller: ยืนยันสลิปสุดท้าย
router.post("/confirmed-slip/:bookingId", isAuthenticated, confirmedSlipBySeller);

/* -------------------------------------------------------------
 * Stripe Payments
 * ----------------------------------------------------------- */

router.post("/create/payment", isAuthenticated, createStripePaymentIntent);

// (ถ้าจะใช้ Webhook จริงให้เปิด route นี้ และอย่าผ่าน body-parser json)
// router.post("/payments/stripe/webhook", handleStripeWebhook);

export default router;
