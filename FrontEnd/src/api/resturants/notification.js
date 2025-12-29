import { BASE_URL, RestaurantNotifications } from "../constants/resturants/endPoints";
import { getAuthHeaders } from "../authHeader";

/* ===============================
   GET ALL RESTAURANT NOTIFICATIONS
================================ */
export const getAllNotifications = async () => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${RestaurantNotifications.getAll}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch notifications");
    }

    return data;
  } catch (error) {
    throw new Error(`getAllNotifications error: ${error.message}`);
  }
};

/* ===============================
   GET UNREAD COUNT (🔔 BADGE)
================================ */
export const getUnreadCount = async () => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${RestaurantNotifications.unreadCount}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch unread count");
    }

    return data;
  } catch (error) {
    throw new Error(`getUnreadCount error: ${error.message}`);
  }
};

export const getResturantUnreadNotificationCount = async () => {
  try {
    const headers = await getAuthHeaders(true);
    const response = await fetch(
      `${BASE_URL}${RestaurantNotifications.unreadCount}`,
      { 
        method: "GET",
        headers 
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch unread count");
    }
    return data;
  }
  catch (error) { 
    console.error("❌ getResturantUnreadNotificationCount error:", error);
    throw error;
  }
};
