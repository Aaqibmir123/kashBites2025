import Notification from "../../models/Notification.js";
import Order from "../../models/Order.js";

export const getAdminNotifications = async (req, res) => {
  try {
    // 🔍 DEBUG LOG
    console.log("✅ ADMIN notifications API HIT");

    const notifications = await Notification.find({
      receiverType: "ADMIN",
    }).sort({ createdAt: -1 });

    console.log("📦 Notifications count:", notifications.length);

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



export const getAdminOrders = async (req, res) => {
  try {

    const orders = await Order.find({})
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Admin orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const markAdminNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

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


