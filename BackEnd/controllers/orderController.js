import Order from "../models/Order.js";
import Notification from "../models/Notification.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      address,
      product,
      restaurantId,
    } = req.body;

    // 🔥 Save Order
    const newOrder = await Order.create({
      address,
      product,
      restaurantId,
    });

    // 🔥 Create Notification for Restaurant
    await Notification.create({
      restaurantId,
      message: `New order received: ${product.name} (Qty: ${product.qty})`,
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
