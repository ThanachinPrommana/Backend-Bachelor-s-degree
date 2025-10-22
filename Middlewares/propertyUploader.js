// Middlewares/propertyUploader.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

/**
 * ใช้ CloudinaryStorage:
 * - Multer จะอัปขึ้น Cloudinary ให้ทันทีระหว่างรับไฟล์
 * - ใน controller อ่านค่าจาก req.files โดยตรง (file.path = secure_url, file.filename = public_id)
 * - ห้ามอัปโหลดซ้ำด้วย cloudinary.uploader.upload(file.path)
 */

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    if (file.mimetype.startsWith("image/")) {
      return {
        folder: "property_images",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        // transformation: [{ quality: "auto", fetch_format: "auto" }],
      };
    }
    if (file.mimetype.startsWith("video/")) {
      return {
        folder: "property_videos",
        resource_type: "video",
        allowed_formats: ["mp4", "mov", "webm"],
      };
    }
    // กันไฟล์ชนิดอื่น ๆ ออก โดยให้ fileFilter ตัดทิ้ง
    return { folder: "raw_uploads", resource_type: "raw" };
  },
});

const fileFilter = (_req, file, cb) => {
  const ok =
    file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
  if (ok) return cb(null, true);
  return cb(
    new Error("File type not supported! Please upload only images or videos."),
    false
  );
};

const propertyUpload = multer({
  storage,
  fileFilter,
  limits: {
    // เผื่อกว่าฝั่ง Front: รูป ~5MB, วิดีโอ ~50MB
    fileSize: 60 * 1024 * 1024, // สูงสุดต่อไฟล์ 60MB
    files: 7, // รวมสูงสุด 7 ไฟล์ (5 รูป + 2 วิดีโอ)
  },
});

export default propertyUpload;
