// middlewares/authCheck.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

/* ============================
 *  Multer / Cloudinary Upload
 * ============================ */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder;
    let resource_type;
    let allowed_formats;

    if (file.mimetype.startsWith("image")) {
      folder = "property_images";
      resource_type = "image";
      allowed_formats = ["jpg", "jpeg", "png", "gif"];
    } else if (file.mimetype.startsWith("video")) {
      folder = "property_videos";
      resource_type = "video";
      allowed_formats = ["mp4", "mov", "avi", "mkv"];
    } else {
      // ไม่ throw ที่นี่ ให้ multer จัดการผ่าน fileFilter
      return { error: "Invalid file type" };
    }
    return {
      folder,
      resource_type,
      allowed_formats,
      // transformation: [{ width: 500, height: 500, crop: "limit" }], // เปิดใช้ถ้าต้องการ
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 100 }, // 100MB
});

/* ============================
 *  JWT Auth (Bearer)
 * ============================ */
const authCheck = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: String(decoded.id) },
      select: { id: true, Email: true, userType: true },
    });
    if (!user) return res.status(401).json({ message: "User not found" });

    // ตั้ง req.user ให้ controller อื่นใช้เช็ค owner ได้
    req.user = {
      id: String(user.id),
      email: user.Email,        // ⚠️ Prisma field ชื่อ Email (ตัวใหญ่)
      userType: user.userType,
    };
    next();
  } catch (err) {
    console.error("[authCheck] error:", err?.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ============================
 *  Session Auth
 * ============================ */
const isAuthenticated = (req, res, next) => {
  try {
    if (!req.session) {
      console.error("CRITICAL: req.session is undefined");
      return res
        .status(500)
        .json({ message: "Session middleware is not configured correctly." });
    }

    const sessUser = req.session.user;
    if (!sessUser?.id) {
      console.warn("FAILURE: User NOT found in session.");
      return res.status(401).json({ message: "You are not logged in" });
    }

    console.log("SUCCESS: User found in session. Proceeding...");
    // ผูก req.user ให้สม่ำเสมอ
    req.user = {
      id: String(sessUser.id),
      email: sessUser.Email ?? sessUser.email ?? null, // รองรับได้ทั้งสองแบบ
      userType: sessUser.userType,
    };

    return next();
  } catch (err) {
    console.error("[isAuthenticated] error:", err?.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

/* ============================
 *  Named Exports
 * ============================ */
module.exports = {
  authCheck,        // ใช้กับ JWT
  isAuthenticated,  // ใช้กับ Session
  upload,           // ใช้อัปโหลดไฟล์ (image/video)
};
