import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";

export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      address,
      items,
      itemTotal,
      deliveryFee,
      platformFee,
      gst,
      totalAmount,
      paymentMethod,
    } = req.body;

    // ✅ Validation
    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !address ||
      !address.name ||
      !address.phone ||
      !address.house ||
      !address.village
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const restaurantId = items[0].restaurantId;

    // ✅ Create Order
    const newOrder = await Order.create({
      userId,
      address,
      items,
      restaurantId,
      itemTotal,
      deliveryFee,
      platformFee,
      gst,
      totalAmount,
      paymentMethod,
      status: "Pending",
    });

    // ===============================
    // 🔔 Notification message
    // ===============================

    const itemCount = items.length;

    const notificationMessage = `
      New Order Received 🍽️
      Name: ${address.name}
      Address: ${address.house}, ${address.village}
      Items: ${itemCount}
      Total: ₹${totalAmount}
      `.trim();

    // ===============================
    // 🔔 CREATE NOTIFICATIONS
    // ===============================

    await Notification.insertMany([
      {
        receiverType: "RESTAURANT",
        restaurantId,
        orderId: newOrder._id,
        message: notificationMessage,
      },
      {
        receiverType: "ADMIN",
        orderId: newOrder._id,
        message: notificationMessage,
      },
    ]);

    // ===============================
    // ✅ RESPONSE
    // ===============================
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("Place Order Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

export const userOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({
      $or: [
        { userId: new mongoose.Types.ObjectId(userId) },
        { userId: userId }, // 👈 OLD STRING SUPPORT
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getLastOrderAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId, "user id in last address");

    const lastOrder = await Order.findOne({ userId })
      .sort({ createdAt: -1 })
      .select("address");
    console.log(lastOrder, "last order in last address");
    if (!lastOrder) {
      return res.status(200).json({
        success: true,
        address: null,
      });
    }

    return res.status(200).json({
      success: true,
      address: lastOrder.address,
    });
  } catch (error) {
    console.error("Get Last Address Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
