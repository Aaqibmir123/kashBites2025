import { UserNotification,BASE_URL } from "../constants/user/endpoints";
import { getAuthHeaders } from "../authHeader";

/* ================= GET USER NOTIFICATIONS ================= */
export const getUserNotificationsApi = async () => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${UserNotification.getAll}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch notifications");
    }

    return data;
  } catch (error) {
    console.error("❌ getUserNotificationsApi error:", error);
    throw error;
  }
};

/* ================= MARK NOTIFICATION AS READ ================= */
export const markUserNotificationAsRead = async (notificationId) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${UserNotification.markAsRead}`, // ✅ FIXED
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ notificationId }), // ✅ BODY
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to mark notification as read");
    }

    return data;
  } catch (error) {
    console.error("❌ markUserNotificationAsRead error:", error);
    throw error;
  }
};

/* ================= GET UNREAD NOTIFICATIONS COUNT ================= */
export const getUserUnreadNotificationCount = async () => {
  try {
    const headers = await getAuthHeaders(true);
    const response = await fetch(
      `${BASE_URL}${UserNotification.getUnreadCount}`,
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
    console.error("❌ getUserUnreadNotificationCount error:", error);
    throw error;
  }
};
