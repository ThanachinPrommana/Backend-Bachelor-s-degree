// Middlewares/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images",
    resource_type: "image",
    // ✅ รองรับ webp (และ heic/heif ถ้าต้องการ)
    allowed_formats: ["jpg", "jpeg", "png", "webp", "heic", "heif"],
    // ลดงานฝั่ง client/Server-side ให้ Cloudinary ช่วยบีบอัด/แปลงอัตโนมัติ
    quality: "auto:good",
    fetch_format: "auto",
    // resize แบบไม่ครอปเกินกรอบ
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    // ใช้ชื่อไฟล์เดิมและเขียนทับรูปเก่าได้ (ปรับตามที่ต้องการ)
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("กรุณาอัปโหลดเฉพาะไฟล์รูปภาพเท่านั้น!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  // ไม่จำเป็นต้องตั้งสูงมาก เพราะฝั่ง client คุณย่อภาพแล้ว
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB (ปรับได้)
});

export default upload;
