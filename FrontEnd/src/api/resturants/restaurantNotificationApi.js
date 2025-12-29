import { BASE_URL ,RestaurantNotifications } from "../constants/resturants/endPoints";
import { getAuthHeaders } from "../../api/authHeader";

/* ===============================
   GET ALL RESTAURANT NOTIFICATIONS
================================ */
export const getRestaurantNotificationsApi = async (restaurantId) => {
  try {
    const headers = await getAuthHeaders(true);

    const res = await fetch(
      `${BASE_URL}${RestaurantNotifications.getAll}?restaurantId=${restaurantId}`,
      {
        method: "GET",
        headers, // ✅ token added
      }
    );

    return await res.json();
  } catch (error) {
    console.log("❌ Get notifications API error:", error);
    return { success: false };
  }
};

/* ===============================
   GET UNREAD COUNT (🔔 BADGE)
================================ */
export const getRestaurantUnreadCountApi = async (restaurantId) => {
  try {
    const headers = await getAuthHeaders(true);

    const res = await fetch(
      `${BASE_URL}${RestaurantNotifications.unreadCount}?restaurantId=${restaurantId}`,
      {
        method: "GET",
        headers, // ✅ token added
      }
    );

    return await res.json();
  } catch (error) {
    console.log("❌ Unread count API error:", error);
    return { success: false, count: 0 };
  }
};

/* ===============================
   MARK NOTIFICATION AS READ
================================ */
export const markRestaurantNotificationReadApi = async (notificationId) => {
  try {
    const headers = await getAuthHeaders(true);

    const res = await fetch(
      `${BASE_URL}${RestaurantNotifications.markRead}`,
      {
        method: "PATCH",
        headers: {
          ...headers, // ✅ token preserved
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
        }),
      }
    );

    return await res.json();
  } catch (error) {
    console.log("❌ Mark read API error:", error);
    return { success: false };
  }
};

/* ===============================
   SAVE USER PUSH TOKEN
================================ */
