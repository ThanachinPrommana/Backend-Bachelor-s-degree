// routes/auth.js
const express = require("express");
const router = express.Router();

const {
  preRegister,
  login,
  forgotPassword,
  resetPassword,
  verifyandregister,
  getProfile,
  logout,
  registerSeller,
} = require("../controllers/auth");

const { isAuthenticated, upload } = require("../middlewares/authCheck");

// สมัคร/ยืนยัน/ล็อกอิน
router.post("/preRegister", preRegister);
router.post("/verifyandregister", verifyandregister);
router.post("/login", login);

// สมัครเป็นผู้ขาย: ต้องล็อกอินก่อน + อัปโหลดรูปบัตร
router.post(
  "/seller/register",
  isAuthenticated,
  upload.single("nationalIdImage"),
  registerSeller
);

// รีเซ็ตรหัสผ่าน
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

// โปรไฟล์
router.get("/profiles/user", isAuthenticated, getProfile);

// ออกจากระบบ
router.post("/logout", logout);

module.exports = router;
