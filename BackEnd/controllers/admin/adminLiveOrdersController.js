import Order from "../../models/Order.js";

export const getAdminLiveOrders = async (req, res) => {
  try {
    const { status } = req.query;
    console.log("ADMIN ORDERS STATUS:", status);

    const filter = {};
    if (status && status !== "All") {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: orders.map(order => ({
        orderId: order._id,
        restaurantName: order.restaurantId?.name || "N/A",
        productName: order.product?.name || "N/A",
        productImage: order.product?.image || null,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt,
        rejectedAt: order.rejectedAt,
      })),
    });
  } catch (err) {
    console.error("Admin orders error:", err);
    res.status(500).json({ success: false });
  }
};

