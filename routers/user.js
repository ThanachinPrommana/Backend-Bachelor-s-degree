// routes/user.js (ESM)

import express from "express";
const router = express.Router();

import {
  updateStatusSeller,
  deleteUser,
  listUserSeller,
  listUserBuyer,
  getUserProfile,
  updateUser,
  updateimage,
  getSellerProfile,
  updateSeller,
  getpostBySeller,
  getdeposits,
  useruploadDocument,
  searchFiltersSeller,
  deletePostBySeller,
  createdeposite,
  updateDepositStatus,
} from "../controllers/user.js";

import { isAuthenticated } from "../Middlewares/authCheck.js";
import upload from "../Middlewares/upload.js";             // ✅ ใช้อัปโหลดรูปโปรไฟล์
import uploadDocument from "../Middlewares/document.js";   // ✅ ใช้อัปโหลดเอกสารผู้ใช้

// ==================== Buyer routes ====================

// ดึงรายชื่อ Buyer ทั้งหมด
router.get("/userBuyer", listUserBuyer);

// ดึงโปรไฟล์ Buyer ตาม id
router.get("/profile/:id", getUserProfile);

// อัปเดตโปรไฟล์ Buyer (ต้องล็อกอิน)
router.patch("/profile", isAuthenticated, updateUser);

// สร้างข้อมูลการมัดจำ
router.post("/user/create/deposit", isAuthenticated, createdeposite);

// ดึงข้อมูลมัดจำทั้งหมด
router.get("/deposit", getdeposits);

// อัปเดตสถานะมัดจำ
router.patch(
  "/update/status/deposit/:depositId",
  isAuthenticated,
  updateDepositStatus
);

// ==================== Uploads ====================

// อัปโหลดรูปโปรไฟล์
router.post("/image", isAuthenticated, upload.single("image"), updateimage);

// อัปโหลดเอกสารผู้ใช้ (pdf, doc, jpg, png ฯลฯ)
router.post(
  "/document",
  isAuthenticated,
  uploadDocument.single("document"),
  useruploadDocument
);

// ==================== Seller routes ====================

// ดึงโปรไฟล์ Seller ตาม id
router.get("/seller/profile/:id", getSellerProfile);

// อัปเดตโปรไฟล์ Seller
router.patch("/seller/profile", isAuthenticated, updateSeller);

// ดึงโพสต์ทั้งหมดของ Seller
router.get("/seller/posts/:id", getpostBySeller);

// อัปเดตสถานะ Seller (Admin ใช้)
router.patch("/seller/status/:id", isAuthenticated, updateStatusSeller);

// ลบ Seller ออกจากระบบ
router.delete("/seller/:id", isAuthenticated, deleteUser);

// ลบโพสต์ของ Seller
router.delete("/seller/post/:id", isAuthenticated, deletePostBySeller);

// ==================== Search ====================

// ฟิลเตอร์ค้นหาสำหรับ Seller
router.post("/search/filters/seller", searchFiltersSeller);

export default router;
