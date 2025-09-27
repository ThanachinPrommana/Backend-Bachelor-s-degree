// routes/auth.js (merged & reconciled, ESM)

import express from "express";
const router = express.Router();

import {
  preRegister,
  login,
  forgotPassword,
  resetPassword,
  verifyandregister,
  getProfile,
  logout,
  registerSeller,
} from "../controllers/auth.js";

import { isAuthenticated } from "../Middlewares/authCheck.js";
import { uploadNationalId } from "../Middlewares/uploadNationalIdImage.js";
// ^ ใช้ตัวอัปโหลดเฉพาะสำหรับบัตรประชาชน (โฟลเดอร์ seller_documents)

// สมัคร/ยืนยัน/ล็อกอิน
router.post("/preRegister", preRegister);
router.post("/verifyandregister", verifyandregister);
router.post("/login", login);

// สมัครเป็นผู้ขาย: ต้องล็อกอินก่อน + อัปโหลดรูปบัตร
router.post(
  "/seller/register",
  isAuthenticated,
  uploadNationalId.single("nationalIdImage"),
  registerSeller
);

// รีเซ็ตรหัสผ่าน
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

// โปรไฟล์
router.get("/profiles/user", isAuthenticated, getProfile);

// ออกจากระบบ
router.post("/logout", logout);

export default router;
