// routers/datetimeslot.js (ESM)
import express from "express";
import { getAvailableSlotsForPost } from "../controllers/datetimeslot.js";

const router = express.Router();

// Get available slots by postId
router.get("/list/slots/:postId", getAvailableSlotsForPost);

export default router;
