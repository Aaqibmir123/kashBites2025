import { BASE_URL, adminOrders } from "../constants/admin/endPoints";

export const getAdminOrdersApi = async (status = "All") => {
  try {
    const url =
      status === "All"
        ? `${BASE_URL}${adminOrders.liveOrders}`
        : `${BASE_URL}${adminOrders.liveOrders}?status=${status}`;

    console.log("API HIT:", url);

    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.log("Admin orders api error:", err);
    return { success: false };
  }
};
