import jwt from 'jsonwebtoken';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
// middleware ตรวจสอบ token และสิทธิ์ role
export const authCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      id: user.id,
      email: user.email,
      userType: user.userType,
    };

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      // params: {
      //   folder: "profile_images",
      //   allowed_formats: ["jpg", "jpeg", "png"],
      //   transformation: [{ width: 500, height: 500, crop: "limit" }],
      // },  
      params: async (req, file) => {
        let folder
        let resource_type
        let allowed_formats

        if (file.mimetype.startsWith("image")) {
          folder = "property_images"
          resource_type = "image"
          allowed_formats = ["jpg", "jpeg", "png", "gif"]
        } else if (file.mimetype.startsWith("video")) {
          folder = "property_videos"
          resource_type = "video"
          allowed_formats = ["mp4", "mov", "avi", "mkv"]
        } else {
          return {
            error: "Invalid file type"
          }
        }
        return {
          folder: folder,
          resource_type: resource_type,
          allowed_formats: allowed_formats,
        };
      }
    });

    const fileFilter = (req, file, cb) => {
      if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
        cb(null, true); // อนุญาตให้อัปโหลด
      } else {
        cb(new Error("File type not supported!"), false); // ไม่อนุญาต
      }
    };

    // 3. สร้าง Multer instance โดยใช้ storage และ fileFilter ที่เราสร้าง
    const upload = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 100 // จำกัดขนาดไฟล์ 100MB 
      }
    });

    module.exports = upload;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const isAuthenticated = (req, res, next) => {

  if (!req.session) {
    console.log("CRITICAL FAILURE: req.session object does NOT exist.");
    console.log("-------------------------------------------\n");
    return res.status(500).json({ message: 'Session middleware is not configured correctly.' });
  }

  if (req.session && req.session.user) {
    console.log("SUCCESS: User found in session. Proceeding...");
    console.log("-------------------------------------------\n");
    return next();
  } else {
    console.log("FAILURE: User NOT found in session. Sending 401.");
    console.log("-------------------------------------------\n");
    res.status(401).json({ message: 'You are not logged in' });
  }
};

export const isSeller = (req, res, next) => {
  // ตรวจสอบให้แน่ใจว่า req.session.user มีอยู่จริงก่อนจะเช็ค userType
  if (req.session.user && req.session.user.userType === 'Seller') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden: คุณไม่มีสิทธิ์ในการเข้าถึงส่วนนี้' });
};

