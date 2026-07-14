// Middlewares/propertyUploader.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/**
 * Phase 2 – Local Disk Storage (แทน CloudinaryStorage)
 *
 * ไฟล์จะถูกบันทึกลงโฟลเดอร์ชั่วคราว /tmp/uploads ก่อน
 * แล้ว controller / background-job จะนำไปอัปโหลด Cloudinary ต่อ
 * ผลลัพธ์: seller ได้รับ "โพสต์สำเร็จ" ทันที ไม่ต้องรอรูปอัปโหลดเสร็จ
 *
 * ค่าที่ใช้งานใน controller (จาก req.files[]):
 *   file.path      – absolute path ของไฟล์ที่บันทึกบน disk
 *   file.filename  – ชื่อไฟล์ที่ถูก rename (unique)
 *   file.mimetype  – image/* หรือ video/*
 */

// ---------------------------------------------------------------------------
// สร้างโฟลเดอร์ tmp ถ้ายังไม่มี
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TMP_UPLOAD_DIR = path.join(__dirname, "..", "tmp", "uploads");
if (!fs.existsSync(TMP_UPLOAD_DIR)) {
  fs.mkdirSync(TMP_UPLOAD_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// diskStorage – บันทึกไฟล์ลง local disk
// ---------------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, TMP_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // ตั้งชื่อไฟล์ให้ unique: timestamp-random.ext
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

// ---------------------------------------------------------------------------
// fileFilter – อนุญาตเฉพาะ image/* และ video/*
// ---------------------------------------------------------------------------
const fileFilter = (_req, file, cb) => {
  const ok =
    file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
  if (ok) return cb(null, true);
  return cb(
    new Error("File type not supported! Please upload only images or videos."),
    false
  );
};

// ---------------------------------------------------------------------------
// multer instance
// ---------------------------------------------------------------------------
const propertyUpload = multer({
  storage,
  fileFilter,
  limits: {
    // เผื่อกว่าฝั่ง Front: รูป ~5MB, วิดีโอ ~50MB
    fileSize: 60 * 1024 * 1024, // สูงสุดต่อไฟล์ 60MB
    files: 7, // รวมสูงสุด 7 ไฟล์ (5 รูป + 2 วิดีโอ)
  },
});

export { TMP_UPLOAD_DIR };
export default propertyUpload;
