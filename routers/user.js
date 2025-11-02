// routers/user.merged.final.js
import express from "express";
import upload from "../Middlewares/upload.js";
import uploadDocument from "../Middlewares/document.js";
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
  confirmPurchaseByBuyer
} from "../controllers/user.js";

import {
  createStripePaymentIntent,
  // ⚠️ หากต้องใช้ Stripe Webhook ให้เปิดคอมเมนต์สองบรรทัดด้านล่าง และตั้ง route แยกด้วย express.raw()
  // handleStripeWebhook
} from "../controllers/payment.js";

/* -------------------------------------------------------------
 * Admin / Management (ควรมี adminOnly middleware ถ้ามี)
 * ----------------------------------------------------------- */

// อัปเดตสถานะผู้ขาย (APPROVED/REJECTED/PENDING)
router.patch("/seller/:sellerId/status", isAuthenticated, updateStatusSeller);

// Back-compat (เดิมเคยใช้ /seller/status/:id)
router.patch("/seller/status/:id", isAuthenticated, (req, res, next) => {
  req.params.sellerId = req.params.id;
  return updateStatusSeller(req, res, next);
});

// ลบผู้ใช้ (Admin)
router.delete("/user/:id", isAuthenticated, deleteUser);
// Back-compat (บางที่เคยเรียก /seller/:id เพื่อลบ user)
router.delete("/seller/:id", isAuthenticated, deleteUser);

/* -------------------------------------------------------------
 * Lists / Search
 * ----------------------------------------------------------- */

// รายชื่อผู้ขาย/ผู้ซื้อทั้งหมด (สำหรับหน้า Admin/Backoffice)
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

// ดึงโพสต์ของผู้ขายคนปัจจุบัน
router.get("/post/seller", isAuthenticated, getpostBySeller);
// Back-compat (บางที่เคยใช้ /seller/posts/:id)
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

// อัปโหลดเอกสารยืนยันมัดจำ/ยูนิต
router.post(
  "/document",
  isAuthenticated,
  uploadDocument.array("documents", 3),
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

// ⚠️ ถ้าต้องใช้ Webhook ให้เปิดใช้งานตามแบบด้านล่าง
// หมายเหตุ: ต้องประกาศ route นี้ก่อนใช้ express.json() ที่ระดับแอป
// import bodyParser from "body-parser";
// router.post(
//   "/payments/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   handleStripeWebhook
// );

router.post("/confirmed/booking/:bookingId", isAuthenticated, confirmPurchaseByBuyer);

export default router;
