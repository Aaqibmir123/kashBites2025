/* ===============================
   BASE URLS
================================ */
export const BASE_URL = "http://10.138.207.173:5000/api/user";
export const BASE_IMAGE_URL = "http://10.138.207.173:5000";

/* ===============================
   USER PROFILE
================================ */
export const Profile = {
  getProfile: "/profile",
  updateProfile: "/profile",
};

/* ===============================
   USER ADDRESS
================================ */
export const Address = {
  addAddress: "/user/address/add",
};

/* ===============================
   CART
================================ */
export const Cart = {
  addToCart: "/cart/add",
  getCart: "/cart/:userId", // GET
  removeFromCart: "/cart/remove",
  clearCart: "/cart/:userId", // ✅ FIX
};

/* ===============================
   USER ORDERS
================================ */
export const Order = {
  placeOrder: "/orders/place", // POST
  getOrders: "/orders/:userId", // GET ✅
  getAddresses: "/address/get-addresses",
};

/* ===============================
   USER PRODUCTS
================================ */
export const Products = {
  addProduct: "/user/products/add",
};

//
export const GetAllProducts = {
  getAllProducts: "/showProducts", // ✅ GET
};

/* ===============================
   RESTAURANT LIST
================================ */
export const Restaurant = {
  getRestaurants: "/restaurantsList/get-restaurants", // ✅ correct
  getProducts: "/restaurantsList/products", // ✅ correct
};

/* ===============================
   USER NOTIFICATIONS
================================ */
export const UserNotification = {
  getAll: "/notifications",
  markAsRead: "/notifications/read",
  getUnreadCount: "/notifications/unreadCount",
};

/* ===============================
   USER FAVORITES
================================ */
export const Favorite = {
  toggleFavorite: "/favorite/toggle",
  getFavorites: "/favorite/get",
};


/* ===============================
   USER SUPPORT
================================ */
export const Support = {
  getConversation: "/support/conversation",
  sendMessage: "/support/message",
  getMessages: "/support/messages", // + conversationId
};