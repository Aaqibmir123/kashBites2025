/* ===============================
   BASE URLS
================================ */
export const BASE_URL = "http://10.138.207.173:5000/api/restaurant";
export const BASE_IMAGE_URL = "http://10.138.207.173:5000";


/* ===============================
   RESTAURANT ADDRESS
================================ */
export const RestaurantAddress = {
  addAddress: "/address/restaurantsAddress",
  getRestaurantAddress: "/address/getrestaurantsAddress", // + /:restaurantId
};

/* ===============================
   RESTAURANT NOTIFICATIONS
================================ */
export const RestaurantNotifications = {
  getAll: "/notifications",
  unreadCount: "/notifications/unreadcount",
  markRead: "/notifications/read",
};


/* ===============================
   RESTAURANT DASHBOARD
================================ */
export const ResturantDashboard = {
  daily: "/dashboard/today",
  weeklySales: "/dashboard/weekly",
  monthlySales: "/dashboard/monthly",
};

export const RESTAURANT_ORDERS = {
  GET_ORDERS: "/orders",              // GET    /orders?status=
  UPDATE_STATUS: "/orders",           // PATCH  /orders/:orderId/status
  STATUS_COUNT: "/orders/status-count", // GET  /orders/status-count
};

/* ===============================
   RESTAURANT PRODUCTS  ✅ (THIS WAS MISSING)
================================ */
export const RestaurantProduct = {
  addProduct: "/products",                  // POST
  getProducts: "/products/restaurant",      // GET + /:restaurantId
  updateProduct: "/products",               // PUT + /:productId
  deleteProduct: "/products",               // DELETE + /:productId
};

/* ===============================
   RESTAURANT PROFILE
================================ */
export const Profile = {
  getProfile: "/profile",          // GET
  updateProfile: "/profile",       // PUT
};

