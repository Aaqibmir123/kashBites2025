export const BASE_URL = "http://10.12.209.173:5000/api";
export const BASE_IMAGE_URL = "http://10.12.209.173:5000";

//Auth
export const AUTH = {
  LOGIN: "/send-otp",
  VERIFY_OTP: "/verify-otp",
};

//productsApi
export const Products = {
  addProduct: "/add-product",
};

//Address api
export const Address = {
  addAdress: "/add-address",
};

//Profile api
export const Profile = {
  getProfile: "/get-profile",
  updateProfile: "/update",
};
//AddToCart api
export const Cart = {
  addToCart: "/add-to-cart",
  getCart: "/get-cart/:userId",
  removeFromCart: "/remove-from-cart",
  clearCard:'/clear/:userId',
};

//Restaurant api
export const Restaurant = {
  addRestaurant: "/add-restaurants",
  getRestaurants: "/get-restaurants",
  updateRestaurant: "/update-restaurant/",
  deleteRestaurant: "/delete-restaurant/",
};

//Add Product api for restaurant
export const RestaurantProduct = {
  addProduct: "/add-product-resturant",
  getProducts: "/get-products/",
  updateProduct: "/update-resturant-product/",
};

//getAllProducts api
export const AllProducts = {
  getAllProducts: "/get-all-products",
  getSingleProduct: "/get-single-product/",
};

//Order api
export const Order = {
  placeOrder: "/place-order",
  getOrders: "/user-orders",
};
