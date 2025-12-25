import Order from "../../models/Order.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Delivered" })
      .populate("restaurantId", "name")
      .sort({ deliveredAt: -1 });

    const commissionDetails = orders.map((order) => ({
      orderId: order._id,
      restaurantName: order.restaurantId?.name || "N/A",
      productName: order.product?.name || "N/A",
      productImage: order.product?.image || null, // 👈 IMAGE

      totalAmount: order.totalAmount,
      commissionAmount: order.commissionAmount,
      deliveredAt: order.deliveredAt,
    }));

    return res.status(200).json({
      success: true,
      data: commissionDetails,
    });
  } catch (error) {
    console.error("Commission details error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
