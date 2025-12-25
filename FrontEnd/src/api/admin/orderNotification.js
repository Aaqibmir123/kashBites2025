import {
  BASE_URL,
  orderNotification,
  getOrders,
} from "../constants/admin/endPoints.js";

/* ================= ADMIN NOTIFICATIONS ================= */

export const getAdminNotificationsApi = async () => {
  try {
    const response = await fetch(
      BASE_URL + orderNotification.getNotification,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (err) {
    throw new Error(
      `API Error in getAdminNotificationsApi: ${err.message}`
    );
  }
};

/* ================= ADMIN ORDERS ================= */

export const getAdminOrdersApi = async () => {
  try {
    const response = await fetch(
      BASE_URL + getOrders.orders,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (err) {
    throw new Error(
      `API Error in getAdminOrdersApi: ${err.message}`
    );
  }
};


export const markAdminNotificationReadApi = async (notificationId) => {
  try {
    const response = await fetch(
      `${BASE_URL}${orderNotification.markRead}/${notificationId}/read`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to mark read");
    }

    return await response.json();
  } catch (err) {
    throw new Error(
      `API Error in markAdminNotificationReadApi: ${err.message}`
    );
  }
};


