import { BASE_URL, ResturantDashboard } from "../constants/resturants/endPoints";
import { getAuthHeaders } from "../../api/authHeader";

/* ===============================
   TODAY STATS
================================ */
export const getTodayDashboardApi = async (restaurantId) => {
  try {
    const headers = await getAuthHeaders(true);

    const res = await fetch(
      `${BASE_URL}${ResturantDashboard.daily}?restaurantId=${restaurantId}`,
      {
        method: "GET",
        headers, // ✅ token added
      }
    );

    return await res.json();
  } catch (error) {
    console.log("Today dashboard API error:", error);
    return { success: false };
  }
};

/* ===============================
   WEEKLY STATS (LAST 7 DAYS)
================================ */
export const getWeeklyDashboardApi = async (restaurantId) => {
  try {
    const headers = await getAuthHeaders(true);

    const res = await fetch(
      `${BASE_URL}${ResturantDashboard.weeklySales}?restaurantId=${restaurantId}`,
      {
        method: "GET",
        headers, // ✅ token added
      }
    );

    return await res.json();
  } catch (error) {
    console.log("Weekly dashboard API error:", error);
    return { success: false };
  }
};

/* ===============================
   MONTHLY STATS
================================ */
export const getMonthlyDashboardApi = async (restaurantId) => {
  try {
    const headers = await getAuthHeaders(true);

    const res = await fetch(
      `${BASE_URL}${ResturantDashboard.monthlySales}?restaurantId=${restaurantId}`,
      {
        method: "GET",
        headers, // ✅ token added
      }
    );

    return await res.json();
  } catch (error) {
    console.log("Monthly dashboard API error:", error);
    return { success: false };
  }
};
