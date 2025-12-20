import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const data = await Notification.find({ restaurantId }).sort({ createdAt: -1 });

    res.json({ success: true, notifications: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
