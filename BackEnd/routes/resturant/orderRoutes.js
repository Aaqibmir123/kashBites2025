import express from "express";
import {
  getRestaurantOrders,
  updateOrderStatus,
  getOrderStatusCount,
} from "../../controllers/ResturantsController/orderController.js";

const router = express.Router();

/* ===============================
   RESTAURANT ORDERS (SIMPLE)
================================ */

// 📦 GET ALL ORDERS
router.get("/", (req, res, next) => {
  console.log("✅ GET /api/restaurant/orders HIT");
  next();
}, getRestaurantOrders);

// 🔁 UPDATE ORDER STATUS
router.patch("/:orderId/status", (req, res, next) => {
  console.log("✅ PATCH /api/restaurant/orders/:orderId/status HIT");
  console.log("OrderId:", req.params.orderId);
  console.log("Status:", req.body.status);
  next();
}, updateOrderStatus);

// 📊 GET ORDER STATUS COUNT
router.get("/status-count", (req, res, next) => {
  console.log("✅ GET /api/restaurant/orders/status-count HIT");
  next();
}, getOrderStatusCount);

export default router;
