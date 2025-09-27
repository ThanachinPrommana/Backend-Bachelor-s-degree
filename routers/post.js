// routes/post.js (ESM)

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
} from "../controllers/post.js";
import { isAuthenticated } from "../Middlewares/authCheck.js";

const router = express.Router();

// Create property post
router.post(
  "/propertypost",
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

// Delete property post
router.delete("/propertypost/:id", removepost);

// Update property post
router.patch(
  "/propertypost/:id",
  propertyUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  updatePost
);

// Search posts by filters
router.post("/search/filters", searchFilters);

export default router;
