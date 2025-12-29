import { BASE_URL, Restaurant } from "../constants/admin/endPoints.js";
import { getAuthHeaders } from "../authHeader.js";

export const addRestaurantApi = async (restaurantData) => {
  try {
    const headers = await getAuthHeaders(false);
    console.log("Headers:", headers);

    const response = await fetch(`${BASE_URL}${Restaurant.addRestaurant}`, {
      method: "POST",
      headers, // ✅ auth only
      body: restaurantData, // ✅ FormData
    });

    return await response.json();
  } catch (error) {
    console.error("Error adding restaurant:", error);
    throw error;
  }
};

export const getAllRestaurantsApi = async () => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(`${BASE_URL}${Restaurant.getRestaurants}`, {
      method: "GET",
      headers, // ✅ token preserved
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

export const updateRestaurantApi = async (id, formData) => {
  try {
    const headers = await getAuthHeaders(false);

    const response = await fetch(
      `${BASE_URL}${Restaurant.updateRestaurant}/${id}`,
      {
        method: "PUT",
        headers, // ✅ auth only
        body: formData, // ✅ FormData
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error updating restaurant:", error);
    throw error;
  }
};

export const deleteRestaurantApi = async (id) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${Restaurant.deleteRestaurant}/${id}`,
      {
        method: "DELETE",
        headers,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};
