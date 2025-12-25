import express from "express";

/* controllers */
import { getAdminDashboard } from "../../controllers/admin/adminDashboardController.js";
import {
  getAdminNotifications,
  getAdminOrders,
  markAdminNotificationRead,
} from "../../controllers/admin/orderNotification.js";
import { getAdminLiveOrders } from "../../controllers/admin/adminLiveOrdersController.js";

const router = express.Router();

/* ===== ADMIN ROUTES (STATIC FIRST) ===== */

// Dashboard
router.get("/dashboard", getAdminDashboard);

// Live Orders
router.get("/live-orders", getAdminLiveOrders);

// Orders (all status + filter)
router.get("/orders", getAdminOrders);

// Notifications
router.get("/notifications", getAdminNotifications);
router.patch("/notifications/:notificationId/read", markAdminNotificationRead);

export default router;
