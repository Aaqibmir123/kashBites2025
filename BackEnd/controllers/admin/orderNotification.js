import Order from "../../models/Order.js";

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

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
