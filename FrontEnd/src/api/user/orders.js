import { BASE_URL, Order } from "../constants/user/endpoints";
import { getAuthHeaders } from "../authHeader";

/* ================= PLACE ORDER ================= */
export const PlaceOrder = async (orderData) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(`${BASE_URL}${Order.placeOrder}`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

/* ================= GET USER ORDERS ================= */
// ❌ userId parameter removed
export const GetUserOrders = async () => {
  try {
    const headers = await getAuthHeaders(false);
    const response = await fetch(`${BASE_URL}${Order.getOrders}`, {
      method: "GET",
      headers,
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};
