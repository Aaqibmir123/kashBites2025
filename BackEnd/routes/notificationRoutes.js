import express from "express";
import { getNotifications } from "../controllers/notificationController.js";

const router = express.Router();

/* ✅ SAFE & EXPLICIT ROUTE */
router.get("/restaurant/:restaurantId", getNotifications);

export default router;
