// routes/post.js (ESM) — FIXED to match server & controllers
import express from "express";
import propertyUpload from "../Middlewares/propertyUploader.js";
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
import { isAuthenticated } from "../Middlewares/authCheck.js";

const router = express.Router();

/**
 * Create property post
 * NOTE: โปรเจ็กต์เดิมใช้ :userId ในพาธ → ใส่กลับให้ตรงกับ controller
 */
router.post(
  "/propertypost/:userId",
  isAuthenticated,
  propertyUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  createpost
);

// Get posts by category
router.get("/post/category/:categoryId", getbycategory);

// Get single property post
router.get("/propertypost/:id", getPost);

// Get all categories
router.get("/allcategory", getallcategory);

// Delete property post (ควรต้องล็อกอิน)
router.delete("/propertypost/:id", isAuthenticated, removepost);

// Update property post (ควรต้องล็อกอิน)
router.patch(
  "/propertypost/:id",
  isAuthenticated,
  propertyUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  updatePost
);

// Search posts by filters
router.post("/search/filters", searchFilters);

// Home page posts
router.get("/homepage/posts", getHomePagePosts);

export default router;
