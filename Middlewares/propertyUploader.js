// File: middleware/propertyUploader.js

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

// 1. สร้าง CloudinaryStorage ที่ตรวจสอบประเภทไฟล์เพื่อกำหนดค่าแบบไดนามิก
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // ตรวจสอบ mimetype ของไฟล์เพื่อกำหนดค่าที่จะส่งให้ Cloudinary
    let folderName;
    let resourceType;
    let allowedFormats;

    if (file.mimetype.startsWith("image")) {
      // ---- กรณีเป็นไฟล์รูปภาพ ----
      folderName = "property_images";
      resourceType = "image";
      allowedFormats = ["jpg", "jpeg", "png", "gif"];
    } else if (file.mimetype.startsWith("video")) {
      // ---- กรณีเป็นไฟล์วิดีโอ ----
      folderName = "property_videos";
      resourceType = "video";
      allowedFormats = ["mp4", "mov", "avi", "mkv"];
    } else {

      return {
        error: "Invalid file type uploaded.",
      };
    }

    // คืนค่า object ที่มี configuration ที่ถูกต้องกลับไป
    return {
      folder: folderName,
      resource_type: resourceType,
      allowed_formats: allowedFormats,

    };
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true); // อนุญาตให้ไฟล์ผ่าน
  } else {
    cb(new Error("File type not supported! Please upload only images or videos."), false); // ปฏิเสธไฟล์
  }
};

// 3. สร้าง Multer instance พร้อม configuration ทั้งหมด
const propertyUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
});

export default propertyUpload;