import Notification from "../../models/Notification.js";
import Order from "../../models/Order.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiverType: "ADMIN",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("❌ Admin notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const markAdminNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "notificationId required",
      });
    }

    await Notification.findByIdAndUpdate(notificationId, {
      read: true,
    });

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAdminUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const count = await Notification.countDocuments({
      receiverType: "USER",
      userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    console.error("❌ getUserUnreadCount error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
