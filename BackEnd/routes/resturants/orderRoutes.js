import express from "express";
import {
  getRestaurantOrders,
  updateOrderStatus,
  getOrderStatusCount,
} from "../../controllers/ResturantsController/orderController.js";

const router = express.Router();

// 📦 Orders list (tabs)
router.get("/orders/:restaurantId", getRestaurantOrders);

// 🔁 Update order status
router.patch("/orders/:orderId/status", updateOrderStatus);

// 📊 Dashboard order status count
router.get("/orders/status-count/:restaurantId", getOrderStatusCount);

export default router;
