import {BASE_URL,Favorite} from "../constants/user/endpoints.js";
import { getAuthHeaders } from "../authHeader";

export const toggleFavoriteApi = async (productId) => {
  try {
    const headers = await getAuthHeaders(true);
    const response = await fetch(`${BASE_URL}${Favorite.toggleFavorite}`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    return await response.json();
    } catch (error) {

    console.error("Error toggling favorite:", error);
    throw error;
  }
};

export const getFavoritesApi = async () => {
  try {
    const headers = await getAuthHeaders(true);
    const response = await fetch(`${BASE_URL}${Favorite.getFavorites}`, {
      method: "GET",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }
    catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  } 
};


