import { BASE_URL, adminDashboard } from "../constants/admin/endPoints";
import { getAuthHeaders } from "../../api/authHeader";

export const getAdminDashboardApi = async () => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      BASE_URL + adminDashboard.dashboard,
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

    const data = await response.json();
    return data;

  } catch (err) {
    throw new Error(`API Error in getAdminDashboardApi: ${err.message}`);
  }
};
