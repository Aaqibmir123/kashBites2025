import Notification from "../../models/Notification.js";

/* ===============================
   GET RESTAURANT NOTIFICATIONS
   (ONLY OWN RESTAURANT)
================================ */
export const getRestaurantNotifications = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId; // ✅ FIX

    const notifications = await Notification.find({
      receiverType: "RESTAURANT",
      restaurantId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("❌ Restaurant notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ===============================
   MARK NOTIFICATION AS READ
================================ */
export const markRestaurantNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const restaurantId = req.user.restaurantId;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "notificationId is required",
      });
    }

    await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        restaurantId,              // 🔐 ownership check
        receiverType: "RESTAURANT",
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("❌ Mark read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ===============================
   GET UNREAD COUNT (🔔 BADGE)
================================ */
export const getRestaurantUnreadCount = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId; // ✅ FIX

    const count = await Notification.countDocuments({
      receiverType: "RESTAURANT",
      restaurantId,
      read: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("❌ Unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

