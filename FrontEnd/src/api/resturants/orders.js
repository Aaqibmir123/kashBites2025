import {
  BASE_URL,
  RESTAURANT_ORDERS,
} from "../constants/resturants/endPoints";
import { getAuthHeaders } from "../../api/authHeader";

/* ================= GET RESTAURANT ORDERS ================= */
export const getRestaurantOrdersApi = async (status = "") => {
  try {
    const headers = await getAuthHeaders(true);

    const url = `${BASE_URL}${RESTAURANT_ORDERS.GET_ORDERS}${
      status ? `?status=${status}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers, // 🔐 token
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    console.error("getRestaurantOrdersApi error:", error.message);
    throw error;
  }
};

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatusApi = async (orderId, status) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${RESTAURANT_ORDERS.UPDATE_STATUS}/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    return await response.json();
  } catch (error) {
    console.error("updateOrderStatusApi error:", error.message);
    throw error;
  }
};

/* ================= ORDER STATUS COUNT ================= */
export const getOrderStatusCountApi = async () => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${RESTAURANT_ORDERS.STATUS_COUNT}`,
      {
        method: "GET",
        headers, // 🔐 token
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch order status count");
    }

    return await response.json();
  } catch (error) {
    console.error("getOrderStatusCountApi error:", error.message);
    throw error;
  }
};
