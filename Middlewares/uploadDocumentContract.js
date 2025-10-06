// Middlewares/uploadDocumentContract.js

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "contracts", // ชื่อโฟลเดอร์ใน Cloudinary ที่จะใช้เก็บไฟล์สัญญา
    resource_type: "auto", // ให้ Cloudinary ตรวจจับประเภทไฟล์อัตโนมัติ (เช่น pdf, image)
    public_id: (req, file) => {
      // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน (แนะนำให้ไม่ใช้ชื่อเดิม)
      // เดิมใช้ req.user.userId แต่ในระบบเรา inject เป็น req.user.id
      const uid = req.user?.userId ?? req.user?.id ?? "anon";
      const fileName = `contract-${uid}-${Date.now()}`;
      return fileName;
    },
  },
});

const uploadContract = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // จำกัดขนาดไฟล์ 10MB
  fileFilter: (req, file, cb) => {
    // สามารถเพิ่มการตรวจสอบประเภทไฟล์ที่นี่ได้ถ้าต้องการ
    // ตัวอย่าง: รับเฉพาะ PDF และรูปภาพ
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("ประเภทไฟล์ไม่รองรับ กรุณาอัปโหลด PDF หรือรูปภาพ"), false);
    }
  },
});

// ใช้แบบ: uploadContract.single("contract")
export { uploadContract };
