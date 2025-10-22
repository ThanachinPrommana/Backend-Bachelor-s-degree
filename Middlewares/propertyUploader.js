// File: Middlewares/propertyUploader.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

/**
 * หมายเหตุสำคัญ:
 * - ใช้ CloudinaryStorage แล้ว => ไฟล์ถูกอัปโหลดขึ้น Cloudinary ทันทีระหว่าง multer ทำงาน
 * - ดังนั้นใน controller "อย่าอัปโหลดซ้ำ" (อย่าเรียก cloudinary.uploader.upload(file.path) อีก)
 *   ให้ดึงข้อมูลจาก req.files โดยตรง เช่น f.secure_url, f.path, f.public_id
 */

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    // รองรับ mimetype ตามที่ฝั่ง Front อนุญาต
    if (file.mimetype.startsWith("image/")) {
      return {
        folder: "property_images",
        resource_type: "image",
        // ✅ เพิ่ม webp ให้ตรงกับฝั่ง Front
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        // สามารถเปิดใช้ได้ถ้าต้องการบีบอัตโนมัติ:
        // transformation: [{ quality: "auto", fetch_format: "auto" }],
      };
    }
    if (file.mimetype.startsWith("video/")) {
      return {
        folder: "property_videos",
        resource_type: "video",
        // ✅ เพิ่ม webm และตัด avi/mkv ที่ Front ไม่ใช้
        allowed_formats: ["mp4", "mov", "webm"],
      };
    }
    // อื่น ๆ ปัดไปเป็น raw (หรือบล็อกทิ้งด้วย fileFilter ด้านล่าง)
    return { folder: "raw_uploads", resource_type: "raw" };
  },
});

const fileFilter = (_req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");
  if (isImage || isVideo) return cb(null, true);
  return cb(
    new Error("File type not supported! Please upload only images or videos."),
    false
  );
};

const propertyUpload = multer({
  storage,
  fileFilter,
  limits: {
    // แนะนำให้ตั้ง size ให้ “เผื่อ” จากฝั่ง Front (รูป ~5MB/ไฟล์, วิดีโอ ~50MB/ไฟล์)
    fileSize: 60 * 1024 * 1024, // 60MB/ไฟล์ (พอสำหรับวิดีโอสั้น)
    files: 7, // 5 รูป + 2 วิดีโอ สูงสุด (ตาม UX ปัจจุบัน)
  },
});

export default propertyUpload;
