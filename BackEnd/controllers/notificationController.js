import Notification from "../models/Notification.js";
import User from "../models/userModel.js";
export const getNotifications = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const data = await Notification.find({ restaurantId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, notifications: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    if (!userId || !title || !body) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const user = await User.findById(userId);

    if (!user || !user.pushToken) {
      return res
        .status(400)
        .json({ success: false, message: "Push token not found" });
    }

    const message = {
      to: user.pushToken,
      sound: "default",
      title,
      body,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    res.json({ success: true, message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
