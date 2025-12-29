import { BASE_URL, adminOrders } from "../constants/admin/endPoints";
import { getAuthHeaders } from "../../api/authHeader";

export const getAdminOrdersApi = async (status = "All") => {
  try {
    const headers = await getAuthHeaders(true);

    const url =
      status === "All"
        ? `${BASE_URL}${adminOrders.liveOrders}`
        : `${BASE_URL}${adminOrders.liveOrders}?status=${status}`;

    console.log("API HIT:", url);

    const res = await fetch(url, {
      method: "GET",
      headers, // ✅ admin token added
    });

    return await res.json();
  } catch (err) {
    console.log("Admin orders api error:", err);
    return { success: false };
  }
};
