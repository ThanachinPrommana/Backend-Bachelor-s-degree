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
    if (file.mimetype.startsWith("image")) {
      return {
        folder: "property_images",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
      };
    }
    if (file.mimetype.startsWith("video")) {
      return {
        folder: "property_videos",
        resource_type: "video",
        allowed_formats: ["mp4", "mov", "avi", "mkv"],
      };
    }
    // ปล่อยให้ fileFilter เป็นคนบล็อกไฟล์ที่ไม่รองรับ
    return { folder: "raw_uploads", resource_type: "raw" };
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

    req.user = {
      id: String(user.id),
      email: user.Email,        // Prisma field 'Email'
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
    // ✅ โปรเจกต์คุณเก็บ userId ไว้ใน session
    const uid = sessUser?.userId ?? sessUser?.id ?? null;
    if (!uid) {
      console.warn("FAILURE: User NOT found in session.");
      return res.status(401).json({ message: "You are not logged in" });
    }

    console.log("SUCCESS: User found in session. Proceeding...");
    req.user = {
      id: String(uid),
      email: sessUser.Email ?? sessUser.email ?? null,
      userType: sessUser.userType,
    };

    next();
  } catch (err) {
    console.error("[isAuthenticated] error:", err?.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const isSeller = (req, res, next) => {
  const sessUser = req.session?.user;
  const userType = sessUser?.userType ?? req.user?.userType;
  if (userType === "Seller") return next();
  return res
    .status(403)
    .json({ message: "Forbidden: คุณไม่มีสิทธิ์ในการเข้าถึงส่วนนี้" });
};

// ✅ export ให้ router ใช้ได้แน่นอน
module.exports = {
  authCheck,       // JWT bearer
  isAuthenticated, // session-based
  isSeller,
  upload,          // ใช้ upload.single("nationalIdImage")
};
