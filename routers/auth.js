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

// ✅ แก้ path ให้ตรงกับโฟลเดอร์จริง (middlewares)
const { isAuthenticated } = require("../middlewares/authCheck");
const uploadNationalId = require("../middlewares/uploadNationalIdImage");

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

// โปรไฟล์ (ต้องล็อกอินด้วย session)
router.get("/profiles/user", isAuthenticated, getProfile);

// ออกจากระบบ (ถ้าต้องการให้ logout ใช้ได้เฉพาะตอนล็อกอิน ให้ครอบ isAuthenticated ด้วยก็ได้)
// router.post("/logout", isAuthenticated, logout);
router.post("/logout", logout);

module.exports = router;
