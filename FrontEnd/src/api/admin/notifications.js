import {
  BASE_URL,
  AdminNotifications,
} from "../constants/admin/endPoints.js";
import { getAuthHeaders } from "../../api/authHeader";

export const getAdminNotificationsApi = async () => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      BASE_URL + AdminNotifications.getAll,
      {
        method: "GET",
        headers: {
          ...headers, // ✅ token added
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

export const markAdminNotificationReadApi = async (notificationId) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${AdminNotifications.markRead}`, // ✅ ONLY /read
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }), // ✅ ID IN BODY
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to mark read");
    }

    return data;
  } catch (err) {
    throw new Error(
      `API Error in markAdminNotificationReadApi: ${err.message}`
    );
  }
};
