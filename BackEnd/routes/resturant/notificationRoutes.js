import express from "express";
import {
  getRestaurantNotifications,
  markRestaurantNotificationRead,
  getRestaurantUnreadCount
} from "../../controllers/ResturantsController/restaurantNotificationController.js";

const router = express.Router();

/* ===============================
   RESTAURANT NOTIFICATIONS
================================ */

// Get all notifications (own restaurant)
router.get("/", getRestaurantNotifications);

// Get unread count (🔔 badge)
router.get("/unreadcount", getRestaurantUnreadCount);

// Mark notification as read
router.patch("/read", markRestaurantNotificationRead);

export default router;
