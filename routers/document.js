// routes/document.js (ESM)

import express from "express";
import {
  approveDocument,
  getDocument,
  searchDocument,
} from "../controllers/document.js";
import { isAuthenticated } from "../Middlewares/authCheck.js";

const router = express.Router();

// Approve document
router.patch("/update/document/:documentId", isAuthenticated, approveDocument);

// Get documents
router.get("/list/document", isAuthenticated, getDocument);

// Search documents
router.get("/query/document", isAuthenticated, searchDocument);

export default router;
