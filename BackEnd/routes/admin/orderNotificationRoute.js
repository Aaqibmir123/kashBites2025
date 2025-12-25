import express from "express";
import {
  getAdminNotifications,
  getAdminOrders,
  markAdminNotificationRead
} from "../../controllers/admin/orderNotification.js";

const router = express.Router();

/* 🔔 Admin Notifications */
router.get("/notifications", getAdminNotifications);

/* 📦 Admin Orders */
router.get("/orders", getAdminOrders);
router.patch("/notifications/:notificationId/read", markAdminNotificationRead);


export default router;
