// routers/admin.js (ESM)
import express from "express";
import { registerAdmin } from "../controllers/admin.js";
// ถ้ามี auth สำหรับ admin ให้ import middleware มาเพิ่มได้

const router = express.Router();

router.post("/register/admin", registerAdmin);

export default router;
