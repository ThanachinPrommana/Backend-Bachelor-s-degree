import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "seller_documents",
        allowed_formats: ["jpg", "jpeg", "png"],
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new Error("กรุณาอัปโหลดเฉพาะไฟล์รูปภาพสำหรับบัตรประชาชน!"), false)
    }
}
const uploadNationalId = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

export default uploadNationalId;