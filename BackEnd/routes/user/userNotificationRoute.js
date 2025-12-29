import express from "express";
import {
  getUserNotifications,
  markUserNotificationRead,
  getUserUnreadCount
} from "../../controllers/user/notificationController.js";

const router = express.Router();

router.get("/", getUserNotifications);

router.patch("/read", markUserNotificationRead);
router.get("/unreadCount", getUserUnreadCount);


export default router;
