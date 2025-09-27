import express from "express";
import {
    getAvailableSlotsForPost
} from "../controllers/datetimeslot.js";
const router = express.Router();


router.get("/list/slots/:postId", getAvailableSlotsForPost);

export default router;