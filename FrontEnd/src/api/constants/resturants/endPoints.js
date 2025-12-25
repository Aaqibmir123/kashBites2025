/* ===============================
   BASE URLS
================================ */
export const BASE_URL = "http://10.12.209.173:5000/api";
export const BASE_IMAGE_URL = "http://10.12.209.173:5000";

/* ===============================
   RESTAURANT ADDRESS
================================ */
export const RestaurantAddress = {
  addAddress: "/restaurantsAddress",
  getRestaurantAddress: "/getrestaurantsAddress",
};

/* ===============================
   RESTAURANT NOTIFICATIONS
================================ */
export const RestaurantNotifications = {
  getAll: "/notifications",
  unreadCount: "/unread-count",
  markRead: "/read",
};

export const ResturantDashboard ={
   daily:'/today',
   weeklySales:'/weekly',
   monthlySales:'/monthly'
}
