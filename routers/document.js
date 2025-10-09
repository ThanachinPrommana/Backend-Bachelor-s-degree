// routes/document.js (ESM, aligned to controllers)
import express from "express";
const router = express.Router();

import { isAuthenticated } from "../Middlewares/authCheck.js";
import {
  approveDocument,
  getDocument,
  searchDocument,
} from "../controllers/document.js";

/**
 * อ้างอิงสัญญาเส้นทางจากที่คุณใช้ใน backend เดิม:
 * - GET    /document/:id         → getDocument
 * - POST   /document/approve/:id → approveDocument
 * - POST   /document/search      → searchDocument
 */
router.get("/document/:id", isAuthenticated, getDocument);
router.post("/document/approve/:id", isAuthenticated, approveDocument);
router.post("/document/search", isAuthenticated, searchDocument);

export default router;
