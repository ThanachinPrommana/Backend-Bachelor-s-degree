// routes/user.js
const express = require("express");
const router = express.Router();

const {
  // Admin / Management
  updateStatusSeller,   // PATCH /seller/:sellerId/status
  deleteUser,           // DELETE /user/:id

  // Lists / Search
  listUserSeller,       // GET /userSeller
  listUserBuyer,        // GET /userBuyer
  searchFiltersSeller,  // GET /search/post/seller?q=...

  // Profiles (read)
  getUserProfile,       // GET /profile/:id            (อ่านโปรไฟล์ Buyer ตาม id) - ยังใช้ภายนอก
  getSellerProfile,     // GET /profileseller/:id      (อ่านโปรไฟล์ Seller ตาม id) - ยังไม่ใช้

  // Profiles (self update)
  updateUser,           // PATCH /profile              (อัปเดต User + Buyer บางส่วน เมื่อเป็นผู้ซื้อ)
  updateSeller,         // PATCH /profileseller        (อัปเดต User + Buyer + Seller พร้อมกัน)
  updateimage,          // POST  /image                (อัปโหลด/อัปเดตรูปโปรไฟล์)

  // Seller posts management (self)
  getpostBySeller,      // GET /post/seller
  deletePostBySeller,   // DELETE /seller/remove/post/:postId

  // Deposits
  createdeposite,       // POST   /user/create/deposit
  getdeposits,          // GET    /deposit            (ของผู้ใช้ที่ล็อกอิน ตาม session)
  updateDepositStatus,  // PATCH  /update/status/deposit/:depositId

  // Documents
  useruploadDocument,   // POST /document

  createBooking,

  createDateTimeSlot
} = require("../controllers/user");

const upload = require("../Middlewares/upload");
const uploadDocument = require("../Middlewares/document");
const { isAuthenticated, isSeller } = require("../Middlewares/authCheck");

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

router.post("/document", uploadDocument.single("document"), useruploadDocument);

//CreateDateSlot
router.post("/seller/slot", isAuthenticated, isSeller, createDateTimeSlot);

//CreateBooking
router.post("/user/booking", isAuthenticated, createBooking);
module.exports = router;
