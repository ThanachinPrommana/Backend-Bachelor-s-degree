import express from "express";
import upload from "../Middlewares/upload.js";
import uploadDocument from "../Middlewares/document.js";
import { isAuthenticated, isSeller } from "../Middlewares/authCheck.js";
import { handleStripeWebhook } from "../controllers/payment.js";

const router = express.Router();

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

  createBooking,

  createDateTimeSlot,
  removeTimeSlot,
  removeBooking,
  uploadFinalSlip,
  confirmedSlipBySeller,
  searchFilterDateTimeSlot
} from "../controllers/user.js";

import { createStripePaymentIntent } from "../controllers/payment.js";

// -------------------------------------------------------------
// Admin / Management (ควรมี adminOnly เพิ่มเติม ถ้ามี middleware)
// -------------------------------------------------------------

// อัปเดตสถานะผู้ขาย (APPROVED/REJECTED/PENDING)
router.patch("/seller/:sellerId/status", isAuthenticated, updateStatusSeller);

// ลบผู้ใช้
router.delete("/user/:id", isAuthenticated, deleteUser);

// -------------------------------------------------------------
// Lists / Search
// -------------------------------------------------------------

router.get("/userSeller", listUserSeller);
router.get("/userBuyer", listUserBuyer);

// ค้นหาโพสต์ของผู้ขาย (เฉพาะของตัวเอง)
router.get("/search/post/seller", isAuthenticated, searchFiltersSeller);

// -------------------------------------------------------------
// Profiles (read-only by id) — ใช้ภายนอก/แอดมิน
// -------------------------------------------------------------

router.get("/profileseller/:id", getSellerProfile); // ยังไม่ใช้ตอนนี้
router.get("/profile/:id", getUserProfile);         // โปรไฟล์ Buyer ตาม id

// -------------------------------------------------------------
// Profiles (self update)
// -------------------------------------------------------------

// อัปเดตโปรไฟล์ “เฉพาะผู้ใช้/ผู้ซื้อ” (User + Buyer บางส่วน)
router.patch("/profile", isAuthenticated, updateUser);

// อัปเดตแบบรวม (User + Buyer + Seller) สำหรับผู้ที่เป็น Seller
router.patch("/profileseller", isAuthenticated, updateSeller);

// อัปเดตรูปโปรไฟล์
router.post("/image", isAuthenticated, upload.single("image"), updateimage);

// -------------------------------------------------------------
// Seller posts management (self)
// -------------------------------------------------------------

router.get("/post/seller", isAuthenticated, getpostBySeller);
router.delete("/seller/remove/post/:postId", isAuthenticated, deletePostBySeller);

// -------------------------------------------------------------
// Deposits
// -------------------------------------------------------------

router.post("/user/create/deposit", isAuthenticated, createdeposite);

// NOTE: ใช้ session ระบุตัวผู้ใช้ที่ล็อกอิน
router.get("/deposit", isAuthenticated, getdeposits);

// ผู้ขายยืนยัน/ปฏิเสธมัดจำ
router.patch("/update/status/deposit/:depositId", isAuthenticated, updateDepositStatus);

// -------------------------------------------------------------
// Documents
// -------------------------------------------------------------

router.post("/document",isAuthenticated,uploadDocument.single("document"), useruploadDocument);

//DateSlot
router.post("/seller/slot", isAuthenticated, isSeller, createDateTimeSlot);
router.delete("/seller/remove/:timeSlotId", isAuthenticated, removeTimeSlot)
//Booking
router.post("/user/booking", isAuthenticated, createBooking);
router.delete("/user/remove/:bookingId", isAuthenticated, removeBooking)
// Payment
router.post("/create/payment", isAuthenticated, createStripePaymentIntent)
// Final UploadSlip
router.post(
  '/upload-final-slip/:bookingId',
  isAuthenticated,             // 1. Middleware: ตรวจสอบก่อนว่าผู้ใช้ login แล้วหรือยัง
  upload.single('finalSlip'),  // 2. Middleware: รับไฟล์จาก form-data ที่มีชื่อ field ว่า 'finalSlip' แล้วส่งไป Cloudinary
  uploadFinalSlip              // 3. Controller: เมื่อ Middleware ทั้งสองทำงานเสร็จ จะเรียกใช้ฟังก์ชันนี้ต่อ
);
//confirmedSlipBySeller
router.post("/confirmed-slip/:bookingId", isAuthenticated, confirmedSlipBySeller)
// Search DateTimeSlot Seller
router.post("/search/slot/seller", isAuthenticated, searchFilterDateTimeSlot);
export default router;
