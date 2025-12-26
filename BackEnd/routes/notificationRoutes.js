import express from "express";
import { getNotifications ,sendNotification} from "../controllers/notificationController.js";

const router = express.Router();

/* ✅ SAFE & EXPLICIT ROUTE */
router.get("/restaurant/:restaurantId", getNotifications);
router.post("/send", sendNotification);


export default router;
