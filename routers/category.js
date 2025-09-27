import express from "express";
import { create, removecategory, list, getById } from "../controllers/category.js";

const router = express.Router();

router.post("/category", create);
router.delete("/category/:id", removecategory);
router.get("/category", list);
router.get("/category/:id", getById);

export default router;
