/* ===============================
   BASE URLS
================================ */
export const BASE_URL = "http://10.138.207.173:5000/api/admin";
export const BASE_IMAGE_URL = "http://10.138.207.173:5000";


//add restaurant endpoints

export const Restaurant = {
  addRestaurant: "/createResturants/add",               // POST
  getRestaurants: "/createResturants",              // GET
  updateRestaurant: "/createResturants",           // PUT + /:restaurantId
  deleteRestaurant: "/createResturants",           // POST + /:restaurantId
};

/* ===============================
   RESTAURANT ADDRESS
================================ */
export const RestaurantAddress = {
  addAddress: "/address",
  getRestaurantAddress: "/address", // + /:restaurantId
};

/* ===============================
   RESTAURANT NOTIFICATIONS
================================ */
export const AdminNotifications = {
  getAll: "/notifications",
  unreadCount: "/notifications/unread-count",
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

/* ===============================
   RESTAURANT ORDERS
================================ */
export const RESTAURANT_ORDERS = {
  GET_ORDERS: "/orders",                 // GET  /orders/:restaurantId?status=
  UPDATE_STATUS: "/orders",              // PATCH /orders/:orderId/status
  STATUS_COUNT: "/orders/status-count",  // GET  /orders/status-count/:restaurantId
};


/* ===============================
   ADMIN PROFILE
================================ */
export const Profile = {
  getProfile: "/profile",
  updateProfile: "/profile",
};

/* ===============================
   Admin SUPPORT
================================ */
export const Support = {
  getConversation: "/support/conversation",
  sendMessage: "/support/message",
  getMessages: "/support/messages", 
};