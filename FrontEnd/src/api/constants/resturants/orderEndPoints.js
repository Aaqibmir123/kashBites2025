export const BASE_URL = "http://10.12.209.173:5000/api";

/* ================= RESTAURANT ================= */

export const RESTAURANT_ORDERS = {
  GET_ORDERS: "/orders",                 // GET  /orders/:restaurantId?status=
  UPDATE_STATUS: "/orders",              // PATCH /orders/:orderId/status
  STATUS_COUNT: "/orders/status-count",  // GET  /orders/status-count/:restaurantId
};
