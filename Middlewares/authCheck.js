// middlewares/authCheck.js (ESM, finalized)

import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

/* ============================
 * Multer / Cloudinary Upload
 * ============================ */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
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
    // ปล่อยให้ fileFilter เป็นคนบล็อกไฟล์ที่ไม่ใช่ image/video
    return { folder: "raw_uploads", resource_type: "raw" };
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

/* ============================
 * JWT Auth (ถ้าบาง route ต้องใช้ Bearer)
 * ============================ */
const authCheck = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const user = await prisma.user.findUnique({
      where: { id: String(decoded.id) },
      select: { id: true, Email: true, userType: true },
    });
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      id: String(user.id),
      email: user.Email,
      userType: user.userType,
    };
    next();
  } catch (err) {
    console.error("[authCheck] error:", err?.message || err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ============================
 * Session Auth (หลักสำหรับเว็บของคุณ)
 * ============================ */
const isAuthenticated = (req, res, next) => {
  try {
    if (!req.session) {
      console.error(
        "CRITICAL: req.session is undefined (check express-session setup)"
      );
      return res
        .status(500)
        .json({ message: "Session middleware is not configured correctly." });
    }

    const sessUser = req.session.user;
    const uid = sessUser?.userId ?? sessUser?.id ?? null;
    if (!uid) {
      console.warn("FAILURE: User NOT found in session.");
      return res.status(401).json({ message: "You are not logged in" });
    }

    // inject ให้ downstream ใช้รูปแบบเดียวกันกับ JWT
    req.user = {
      id: String(uid),
      email: sessUser.Email ?? sessUser.email ?? null,
      userType: sessUser.userType,
    };

    return next();
  } catch (err) {
    console.error("[isAuthenticated] error:", err?.message || err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

/* ============================
 * Role Guards
 * ============================ */
const isSeller = (req, res, next) => {
  const userType = req.session?.user?.userType ?? req.user?.userType;
  if (userType === "Seller") return next();
  return res
    .status(403)
    .json({ message: "Forbidden: คุณไม่มีสิทธิ์ในการเข้าถึงส่วนนี้" });
};

const isAdmin = (req, res, next) => {
  const userType = req.session?.user?.userType ?? req.user?.userType;
  if (userType === "Admin") return next();
  return res.status(403).json({ message: "Forbidden: Admin only" });
};

/* ============================
 * Exports
 * ============================ */
export { authCheck, isAuthenticated, isSeller, isAdmin, upload };
// ตัวอย่างการใช้:
// router.patch("/profile", isAuthenticated, updateUser);
// router.post("/upload", isAuthenticated, upload.single("image"), controller);
