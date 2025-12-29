import {
  BASE_URL,
  getOrders,
} from "../constants/admin/endPoints.js";
import { getAuthHeaders } from "../../api/authHeader";


export const getAdminOrdersApi = async () => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      BASE_URL + getOrders.orders,
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
      `API Error in getAdminOrdersApi: ${err.message}`
    );
  }
};



