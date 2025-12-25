import Order from "../../models/Order.js";
import mongoose from "mongoose";

export const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status } = req.query;

    const filter = { restaurantId };
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Restaurant orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔁 Update status
    order.status = status;

    /* 🔥 ONLY WHEN ORDER IS DELIVERED */
    if (status === "Delivered") {
      const COMMISSION_PERCENT = 5; // ✅ FIXED 5%

      const totalAmount =
        order.product.price * order.product.qty;

      const commissionAmount =
        (totalAmount * COMMISSION_PERCENT) / 100;

      const restaurantEarning =
        totalAmount - commissionAmount;

      order.totalAmount = totalAmount;
      order.commissionAmount = commissionAmount;
      order.restaurantEarning = restaurantEarning;
      order.deliveredAt = new Date();
    }

    /* ❌ IF REJECTED */
    if (status === "Rejected") {
      order.rejectedAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });

  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const getOrderStatusCount = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const counts = await Order.aggregate([
      {
        $match: {
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      delivered: 0,
    };

    counts.forEach((item) => {
      if (item._id === "Pending") result.pending = item.count;

      if (item._id === "Accepted" || item._id === "Ready") {
        result.accepted += item.count;
      }

      if (item._id === "Rejected") result.rejected = item.count;
      if (item._id === "Delivered") result.delivered = item.count;
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Order status count error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



