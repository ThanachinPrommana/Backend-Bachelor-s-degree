// routes/user.merged.final.js
import express from "express";
<<<<<<< Updated upstream
import upload from "../Middlewares/upload.js";              // images / generic single-file
import uploadDocument from "../Middlewares/document.js";    // user documents
=======
import upload from "../Middlewares/upload.js";
import uploadDocument from "../Middlewares/document.js";
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
import { createStripePaymentIntent /*, handleStripeWebhook*/ } from "../controllers/payment.js";

/* -------------------------------------------------------------
 * Admin / Management (ควรมี adminOnly ถ้ามี middleware)
=======
import {
  createStripePaymentIntent,
  // ⚠️ หากต้องใช้ Stripe Webhook ให้เปิดคอมเมนต์สองบรรทัดด้านล่าง และตั้ง route แยกด้วย express.raw()
  // handleStripeWebhook
} from "../controllers/payment.js";

/* -------------------------------------------------------------
 * Admin / Management (ควรมี adminOnly middleware ถ้ามี)
>>>>>>> Stashed changes
 * ----------------------------------------------------------- */

// อัปเดตสถานะผู้ขาย (APPROVED/REJECTED/PENDING)
router.patch("/seller/:sellerId/status", isAuthenticated, updateStatusSeller);

<<<<<<< Updated upstream
// Back-compat alias (old route): /seller/status/:id  → map :id → :sellerId
=======
// Back-compat (เดิมเคยใช้ /seller/status/:id)
>>>>>>> Stashed changes
router.patch("/seller/status/:id", isAuthenticated, (req, res, next) => {
  req.params.sellerId = req.params.id;
  return updateStatusSeller(req, res, next);
});

// ลบผู้ใช้ (Admin)
router.delete("/user/:id", isAuthenticated, deleteUser);
<<<<<<< Updated upstream
// Back-compat alias (old, ใช้ path ว่า /seller/:id แต่ลบ user) — คงไว้เผื่อ FE เก่า
=======
// Back-compat (บางที่เคยเรียก /seller/:id เพื่อลบ user)
>>>>>>> Stashed changes
router.delete("/seller/:id", isAuthenticated, deleteUser);

/* -------------------------------------------------------------
 * Lists / Search
 * ----------------------------------------------------------- */

<<<<<<< Updated upstream
// รายชื่อผู้ขาย/ผู้ซื้อ
router.get("/userSeller", listUserSeller);
router.get("/userBuyer", listUserBuyer);

// ค้นหา “โพสต์ของผู้ขาย (เฉพาะของตัวเอง)”
router.get("/search/post/seller", isAuthenticated, searchFiltersSeller);

// Back-compat alias (เดิมเคยยิงเป็น POST)
=======
// รายชื่อผู้ขาย/ผู้ซื้อทั้งหมด (สำหรับหน้า Admin/Backoffice)
router.get("/userSeller", listUserSeller);
router.get("/userBuyer", listUserBuyer);

// ค้นหาโพสต์ของผู้ขาย (เฉพาะของตัวเอง)
router.get("/search/post/seller", isAuthenticated, searchFiltersSeller);
// Back-compat (เดิมเคยส่งเป็น POST)
>>>>>>> Stashed changes
router.post("/search/filters/seller", isAuthenticated, searchFiltersSeller);

/* -------------------------------------------------------------
 * Profiles (read-only by id)
 * ----------------------------------------------------------- */

<<<<<<< Updated upstream
router.get("/profileseller/:id", getSellerProfile);     // alias เดิม
router.get("/seller/profile/:id", getSellerProfile);    // back-compat ชื่อ path อื่น
router.get("/profile/:id", getUserProfile);             // โปรไฟล์ Buyer ตาม id

/* -------------------------------------------------------------
 * Profiles (self update)
 * ----------------------------------------------------------- */

// อัปเดตโปรไฟล์ “เฉพาะผู้ใช้/ผู้ซื้อ” (User + Buyer)
router.patch("/profile", isAuthenticated, updateUser);

// อัปเดตแบบรวม (User + Buyer + Seller) — เฉพาะ Seller
=======
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
>>>>>>> Stashed changes
router.patch("/profileseller", isAuthenticated, updateSeller);
// Back-compat alias
router.patch("/seller/profile", isAuthenticated, updateSeller);

// อัปเดตรูปโปรไฟล์
router.post("/image", isAuthenticated, upload.single("image"), updateimage);

/* -------------------------------------------------------------
 * Seller posts management (self)
 * ----------------------------------------------------------- */

<<<<<<< Updated upstream
// ดูโพสต์ของผู้ขาย (ของตัวเอง)
router.get("/post/seller", isAuthenticated, getpostBySeller);
// Back-compat alias (บางที่อาจเรียกด้วย path เก่า)
router.get("/seller/posts/:id", isAuthenticated, getpostBySeller);

// ลบโพสต์ของผู้ขาย (ของตัวเอง)
router.delete("/seller/remove/post/:postId", isAuthenticated, deletePostBySeller);
// Back-compat alias: /seller/post/:id → map :id → :postId
=======
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
>>>>>>> Stashed changes
router.delete("/seller/post/:id", isAuthenticated, (req, res, next) => {
  req.params.postId = req.params.id;
  return deletePostBySeller(req, res, next);
});

/* -------------------------------------------------------------
 * Deposits
 * ----------------------------------------------------------- */

<<<<<<< Updated upstream
// สร้างมัดจำ
router.post("/user/create/deposit", isAuthenticated, createdeposite);

// ดูรายการมัดจำของผู้ใช้ปัจจุบัน (ใช้ session)
router.get("/deposit", isAuthenticated, getdeposits);

// ผู้ขายอัปเดตสถานะมัดจำ (CONFIRMED/REJECTED)
router.patch("/update/status/deposit/:depositId", isAuthenticated, updateDepositStatus);

=======
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

>>>>>>> Stashed changes
/* -------------------------------------------------------------
 * Documents
 * ----------------------------------------------------------- */

// อัปโหลดเอกสารยืนยันมัดจำ/ยูนิต
router.post(
  "/document",
  isAuthenticated,
  uploadDocument.single("document"),
  useruploadDocument
);

/* -------------------------------------------------------------
 * DateTime Slots & Booking
 * ----------------------------------------------------------- */

<<<<<<< Updated upstream
// Seller: สร้างช่วงเวลาให้โพสต์
router.post("/seller/slot", isAuthenticated, isSeller, createDateTimeSlot);

// Seller: ลบช่วงเวลา (ลบ booking ที่เกี่ยวข้องอัตโนมัติ)
router.delete("/seller/remove/:timeSlotId", isAuthenticated, removeTimeSlot);

// Seller: ค้นหา slot ของตัวเอง (มี filter)
router.post("/search/slot/seller", isAuthenticated, searchFilterDateTimeSlot);

// Buyer/Seller: สร้าง/ลบ booking
=======
// ผู้ขายสร้างช่วงเวลาให้โพสต์
router.post("/seller/slot", isAuthenticated, isSeller, createDateTimeSlot);

// ผู้ขายลบช่วงเวลา
router.delete("/seller/remove/:timeSlotId", isAuthenticated, removeTimeSlot);

// ผู้ขายค้นหา/กรองช่วงเวลา
router.post("/search/slot/seller", isAuthenticated, searchFilterDateTimeSlot);

// ผู้ใช้จองนัดหมาย (เลือก slot + unit)
>>>>>>> Stashed changes
router.post("/user/booking", isAuthenticated, createBooking);

// ผู้ใช้/ผู้ขายยกเลิกการจองของตัวเอง
router.delete("/user/remove/:bookingId", isAuthenticated, removeBooking);

<<<<<<< Updated upstream
// Buyer: อัปโหลดสลิปจ่ายส่วนที่เหลือ
=======
// ผู้ซื้ออัปโหลดสลิปจ่ายงวดสุดท้าย
>>>>>>> Stashed changes
router.post(
  "/upload-final-slip/:bookingId",
  isAuthenticated,
  upload.single("finalSlip"),
  uploadFinalSlip
);
<<<<<<< Updated upstream

// Seller: ยืนยันสลิปสุดท้าย
router.post("/confirmed-slip/:bookingId", isAuthenticated, confirmedSlipBySeller);

=======

// ผู้ขายยืนยันสลิปงวดสุดท้าย (ปิดการขายยูนิต)
router.post(
  "/confirmed-slip/:bookingId",
  isAuthenticated,
  confirmedSlipBySeller
);

>>>>>>> Stashed changes
/* -------------------------------------------------------------
 * Stripe Payments
 * ----------------------------------------------------------- */

<<<<<<< Updated upstream
router.post("/create/payment", isAuthenticated, createStripePaymentIntent);

// (ถ้าจะใช้ Webhook จริงให้เปิด route นี้ และอย่าผ่าน body-parser json)
// router.post("/payments/stripe/webhook", handleStripeWebhook);
=======
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
>>>>>>> Stashed changes

export default router;
