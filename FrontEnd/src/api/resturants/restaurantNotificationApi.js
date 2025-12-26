import { BASE_URL ,RestaurantNotifications} from "../constants/resturants/endPoints";

/* ===============================
   GET ALL RESTAURANT NOTIFICATIONS
================================ */
export const getRestaurantNotificationsApi = async (restaurantId) => {
  try {
    const res = await fetch(
      `${BASE_URL}${RestaurantNotifications.getAll}?restaurantId=${restaurantId}`
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
    const res = await fetch(
      `${BASE_URL}${RestaurantNotifications.unreadCount}?restaurantId=${restaurantId}`
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
    const res = await fetch(
      `${BASE_URL}${RestaurantNotifications.markRead}`,
      {
        method: "PATCH",
        headers: {
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

