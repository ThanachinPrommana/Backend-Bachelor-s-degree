// File: Middlewares/upload.js

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_images",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

//   params: async (req, file) => {
//     let folder
//     let resource_type
//     let allowed_formats
//
//     if (file.mimetype.startsWith("image")) {
//       folder = "property_images"
//       resource_type = "image"
//       allowed_formats = ["jpg", "jpeg", "png", "gif"]
//     } else if (file.mimetype.startsWith("video")) {
//       folder = "property_videos"
//       resource_type = "video"
//       allowed_formats = ["mp4", "mov", "avi", "mkv"]
//     } else {
//       return {
//         error: "Invalid file type"
//       }
//     }
//     return {
//       folder: folder,
//       resource_type: resource_type,
//       allowed_formats: allowed_formats,
//     };
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
//     cb(null, true); // อนุญาตให้อัปโหลด
//   } else {
//     cb(new Error("File type not supported!"), false); // ไม่อนุญาต
//   }
// };

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("กรุณาอัปโหลดเฉพาะไฟล์รูปภาพเท่านั้น!"), false);
  }
};

// 3. สร้าง Multer instance โดยใช้ storage และ fileFilter ที่เราสร้าง
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100, // จำกัดขนาดไฟล์ 100MB 
  }
});

export default upload;
