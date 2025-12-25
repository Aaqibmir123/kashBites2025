import {
  BASE_URL,
  RESTAURANT_ORDERS,
} from "../constants/resturants/orderEndPoints";

export const getRestaurantOrdersApi = async (restaurantId, status = "") => {
  try {
    const url = `${BASE_URL}${RESTAURANT_ORDERS.GET_ORDERS}/${restaurantId}${
      status ? `?status=${status}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch orders`);
    }

    return await response.json();
  } catch (error) {
    console.error("getRestaurantOrdersApi error:", error.message);
    throw error;
  }
};

export const updateOrderStatusApi = async (orderId, status) => {
  try {
    const response = await fetch(
      `${BASE_URL}${RESTAURANT_ORDERS.UPDATE_STATUS}/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update order status`);
    }

    return await response.json();
  } catch (error) {
    console.error("updateOrderStatusApi error:", error.message);
    throw error;
  }
};

export const getOrderStatusCountApi = async (restaurantId) => {
  try {
    const response = await fetch(
      `${BASE_URL}${RESTAURANT_ORDERS.STATUS_COUNT}/${restaurantId}`
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
