import { BASE_URL, Restaurant } from "../constants/user/endpoints";
import { getAuthHeaders } from "../authHeader";

export const getResturantList = async () => {
  try {
    const headers = await getAuthHeaders(true);
    const response = await fetch(`${BASE_URL}${Restaurant.getRestaurants}`, {
      method: "GET",
      headers, // ✅ token preserved
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching restaurant list:", error);
    throw error;
  }
};
/* ================= GET PRODUCTS BY RESTAURANT ================= */
export const getProductsByRestaurantApi = async (restaurantId) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${Restaurant.getProducts}/${restaurantId}`,
      {
        method: "GET",
        headers, // ✅ token added
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};