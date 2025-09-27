import express from "express";
import { approveDocument, getDocument, searchDocument } from "../controllers/document.js";
import { isAuthenticated } from "../Middlewares/authCheck.js";

const router = express.Router();

router.patch("/update/document/:documentId", isAuthenticated, approveDocument)
router.get("/list/document", isAuthenticated, getDocument)
router.get("/query/document", isAuthenticated,searchDocument)

export default router;
