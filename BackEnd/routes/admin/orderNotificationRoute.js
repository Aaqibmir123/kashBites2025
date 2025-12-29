import express from "express";
import {
  getAdminNotifications,
  markAdminNotificationRead,
} from "../../controllers/admin/notificationController.js";

const router = express.Router();

/* 🔔 Admin Notifications */
router.get("/", getAdminNotifications);

/* ✅ Mark as read */
router.patch("/read", markAdminNotificationRead);

export default router;
