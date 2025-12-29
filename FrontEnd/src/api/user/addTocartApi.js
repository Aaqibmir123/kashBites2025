import { BASE_URL, Cart, Order } from "../constants/user/endpoints";
import { getAuthHeaders } from "../authHeader";

/* ================= ADD TO CART ================= */
export const addToCartApi = async (cartData) => {
  try {
    const headers = await getAuthHeaders(true); // ✅ FIX

    const res = await fetch(BASE_URL + Cart.addToCart, {
      method: "POST",
      headers,
      body: JSON.stringify(cartData), 
    });

    return await res.json();
  } catch (err) {
    console.error("Add to Cart API Error:", err);
  }
};


/* ================= GET CART ================= */
export const getCartApi = async () => {
  try {
    const headers = await getAuthHeaders(false);

    const res = await fetch(BASE_URL + Cart.getCart, {
      method: "GET",
      headers,
    });

    return await res.json();
  } catch (err) {
    console.error("Get Cart API Error:", err);
  }
};

export const removeFromCartApi = async (cartData) => {
  try {
    const headers = await getAuthHeaders(true);

    const res = await fetch(BASE_URL + Cart.removeFromCart, {
      method: "POST",
      headers,
      body: JSON.stringify(cartData),
    });

    return await res.json();
  } catch (err) {
    console.error("Remove from Cart API Error:", err);
  }
};

export const clearCartByRestaurantApi = async (restaurantId) => {

  try {
    const headers = await getAuthHeaders(true); // ✅ JSON header
    console.log("Auth headers:", headers);

    const res = await fetch(
      BASE_URL + Cart.clearCart, // same route
      {
        method: "POST",          // ✅ CHANGE HERE
        headers,
        body: JSON.stringify({
          restaurantId,          // ✅ BODY
        }),
      }
    );

    return await res.json();
  } catch (err) {
    console.error("Clear Cart API Error:", err);
  }
};


export const getUserLastAddressApi = async () => {
  try {
    const headers = await getAuthHeaders(false);

    const res = await fetch(BASE_URL + Order.getAddresses, {
      method: "GET",
      headers,
    });

    return await res.json();
  } catch (err) {
    console.error("Get User Last Address API Error:", err);
  }
};
