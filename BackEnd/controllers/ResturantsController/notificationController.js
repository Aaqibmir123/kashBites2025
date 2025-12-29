import Notification from "../../models/Notification.js";

/* ================= GET RESTAURANT NOTIFICATIONS ================= */
export const getRestaurantNotifications = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID missing",
      });
    }

    const notifications = await Notification.find({
      receiverType: "RESTAURANT",
      restaurantId,
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

/* ================= MARK RESTAURANT NOTIFICATION READ ================= */
export const markRestaurantNotificationRead = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const { notificationId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID missing",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        receiverType: "RESTAURANT",
        restaurantId,
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Restaurant notification marked as read",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getResturantUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const count = await Notification.countDocuments({
      receiverType: "RESTAURANT",
      userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    console.error("❌ getRestaurantUnreadCount error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
