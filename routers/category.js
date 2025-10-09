// routers/category.js (ESM)
import express from "express";
const router = express.Router();

import {
  create,
  removecategory,
  list,
  getById,
} from "../controllers/category.js";

// Create category
router.post("/category", create);

// Remove category by id
router.delete("/category/:id", removecategory);

// List all categories
router.get("/category", list);

// Get category by id
router.get("/category/:id", getById);

export default router;
