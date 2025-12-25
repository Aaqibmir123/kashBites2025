import { BASE_URL, Cart } from "./constants/endpoints";

export const addToCartApi = async (cartData) => {
  try {
    const res = await fetch(BASE_URL + Cart.addToCart, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartData }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Add to Cart API Error:", err);
  }
};
export const getCartApi = async (userId) => {
  try {
    const res = await fetch(
      BASE_URL + Cart.getCart.replace(":userId", userId),
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get Cart API Error:", err);
  }
};

export const removeFromCartApi = async (cartData) => {
  try {
    const res = await fetch(BASE_URL + Cart.removeFromCart, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartData }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Remove from Cart API Error:", err);
  }
};
export const clearCartApi = async (userId) => {
  try {
    const res = await fetch(
      BASE_URL + Cart.clearCard.replace(":userId", userId),
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await res.json();
  } catch (err) {
    console.error("Clear Cart API Error:", err);
  }
};