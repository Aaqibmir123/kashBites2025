import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";

/* =========================
   PLACE ORDER
========================= */
export const placeOrder = async (req, res) => {
  try {
    const { userId, address, product, restaurantId } = req.body;

    if (!userId || !product || !address || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newOrder = await Order.create({
      userId,
      address,
      product,
      restaurantId,
      status: "Pending",
    });

    await Notification.create({
      restaurantId,
      message: `New order received: ${product.name} (Qty: ${product.qty})`,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


/* =========================
   GET USER ORDERS BY USER ID
========================= */

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

