import { BASE_URL, RestaurantAddress } from "../constants/resturants/endPoints";
import { getAuthHeaders } from "../../api/authHeader";

/* ================= ADD RESTAURANT ADDRESS ================= */
export const AddRestaurantAddress = async (data, token) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${RestaurantAddress.addAddress}`,
      {
        method: "POST",
        headers: {
          ...headers, // ✅ token added
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    console.log("Create Restaurant API Error:", error);
    throw error;
  }
};

/* ================= GET RESTAURANT ADDRESS ================= */
export const getRestaurantAddressByIdApi = async (restaurantId) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${RestaurantAddress.getRestaurantAddress}/${restaurantId}`,
      {
        method: "GET",
        headers: {
          ...headers, // ✅ token added
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    console.log("Get Restaurant API Error:", error);
    throw error;
  }
};
