// routes/post.js
import express from "express";
import propertyUpload from "../Middlewares/propertyUploader.js";
import { isAuthenticated } from "../Middlewares/authCheck.js";
import {
  createpost,
  getbycategory,
  getPost,
  removepost,
  updatePost,
  searchFilters,
  getallcategory,
  getHomePagePosts,
} from "../controllers/post.js";

const router = express.Router();

/**
 * สำคัญ:
 * - ใช้ propertyUpload.fields([...]) แค่ที่ไฟล์ route นี้ "ครั้งเดียว"
 * - controller (createpost/updatePost) จะอ่านจาก req.files.images / req.files.videos
 */

router.post(
  "/propertypost",
  isAuthenticated,
  propertyUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  createpost
);

// Get single property post
router.get("/propertypost/:id", getPost);

// Delete property post (ต้องเป็นเจ้าของหรือแอดมิน — เช็คใน controller/ middleware เพิ่มได้)
router.delete("/propertypost/:id", isAuthenticated, removepost);

// Update property post (รองรับอัปเดตรูป/วิดีโอด้วยการอัปใหม่)
router.patch(
  "/propertypost/:id",
  isAuthenticated,
  propertyUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  updatePost
);

// Public feeds / searches
router.post("/search/filters", searchFilters);
router.get("/post/category/:categoryId", getbycategory);
router.get("/allcategory", getallcategory);
router.get("/homepage/posts", getHomePagePosts);

export default router;
