// routers/auth.js (ESM, complete for server ESM)
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

// สมัคร/ยืนยัน/ล็อกอิน
router.post("/preRegister", preRegister);
router.post("/verifyandregister", verifyandregister);
router.post("/login", login);

// สมัครเป็นผู้ขาย: ต้องล็อกอินก่อน + อัปโหลดรูปบัตร ปชช.
router.post(
  "/seller/register",
  isAuthenticated,
  uploadNationalId.single("nationalIdImage"),
  registerSeller
);

// รีเซ็ตรหัสผ่าน
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

// โปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่ (อ่านจาก session)
router.get("/profiles/user", isAuthenticated, getProfile);

// ออกจากระบบ (ต้องอยู่ใน session ก่อน)
router.post("/logout", isAuthenticated, logout);

export default router;
