import Notification from "../../models/Notification.js";

/* ================= GET USER NOTIFICATIONS ================= */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const notifications = await Notification.find({
      receiverType: "USER",
      userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= MARK USER NOTIFICATION READ ================= */
export const markUserNotificationRead = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "notificationId required",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        receiverType: "USER",
        userId,
      },
      { read: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "User notification marked as read",
    });
  } catch (err) {
    console.error("❌ markUserNotificationRead error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET USER UNREAD COUNT ================= */
export const getUserUnreadCount = async (req, res) => {
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
