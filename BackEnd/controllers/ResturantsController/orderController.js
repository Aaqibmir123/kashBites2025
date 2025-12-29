import Order from "../../models/Order.js";
import mongoose from "mongoose";

/* ===============================
   GET RESTAURANT ORDERS
   (TOKEN BASED)
================================ */
export const getRestaurantOrders = async (req, res) => {
  console.log("🔔 getRestaurantOrders called");
  try {
    const restaurantId = req.user.restaurantId; // 🔐 from token
    const { status } = req.query;
    console.log("Restaurant ID:", restaurantId);
    console.log("Status filter:", status);
    console.log(req.body,'body')

    const filter = { restaurantId };
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Restaurant orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   UPDATE ORDER STATUS
================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      restaurantId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    /* ✅ WHEN DELIVERED */
    if (status === "Delivered") {
      const COMMISSION_PERCENT = 5;

      // ✅ itemTotal already exists
      const commissionAmount =
        (order.itemTotal * COMMISSION_PERCENT) / 100;

      const restaurantEarning =
        order.itemTotal - commissionAmount;

      order.commissionAmount = commissionAmount;
      order.restaurantEarning = restaurantEarning;
      order.deliveredAt = new Date();
    }

    /* ❌ WHEN REJECTED */
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
    console.error("❌ Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ===============================
   GET ORDER STATUS COUNT
   (DASHBOARD)
================================ */
export const getOrderStatusCount = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;

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
      if (item._id === "Pending") result.pending += item.count;

      if (item._id === "Accepted" || item._id === "Ready") {
        result.accepted += item.count;
      }

      if (item._id === "Rejected") result.rejected += item.count;
      if (item._id === "Delivered") result.delivered += item.count;
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Order status count error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
