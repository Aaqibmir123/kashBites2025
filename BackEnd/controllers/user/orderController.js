import Order from "../../models/Order.js";
import Notification from "../../models/Notification.js";
import mongoose from "mongoose";

export const placeOrder = async (req, res) => {
  console.log("👤 PLACE ORDER HIT");
  try {
    // 🔒 USER FROM JWT (GOLDEN RULE)
    const userId = req.user.userId || req.user._id;

    const {
      address,
      items,
      itemTotal,
      deliveryFee,
      platformFee,
      gst,
      totalAmount,
      paymentMethod,
    } = req.body;

    /* ================= VALIDATION ================= */
    if (
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

    /* ================= RESTAURANT ================= */
    const restaurantId = items[0].restaurantId;

    /* ================= CREATE ORDER ================= */
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

    /* ================= NOTIFICATION MESSAGE ================= */
    const itemCount = items.length;
    const now = new Date();

    const date = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const notificationMessage = `
      New Order Received 🍽️
      Date: ${date}
      Time: ${time}

      Customer: ${address.name}
      Phone: ${address.phone}
      Address: ${address.house}, ${address.village}
      Items: ${itemCount}
      Total: ₹${totalAmount}
      `.trim();

    /* ================= CREATE NOTIFICATIONS ================= */
    await Notification.insertMany([
      // 🧑 USER
      {
        receiverType: "USER",
        userId,
        orderId: newOrder._id,
        message: "✅ Your order has been placed successfully",
      },

      // 🏪 RESTAURANT
      {
        receiverType: "RESTAURANT",
        restaurantId,
        orderId: newOrder._id,
        message: notificationMessage,
      },

      // 👑 ADMIN
      {
        receiverType: "ADMIN",
        orderId: newOrder._id,
        message: notificationMessage,
      },
    ]);

    /* ================= RESPONSE ================= */
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
  console.log("👤 USER ORDERS HIT");

  try {
    // 🔐 userId ALWAYS from token
    const userId = req.user._id;

    const orders = await Order.find({
      userId: userId, // ObjectId safe
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (err) {
    console.error("USER ORDERS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
