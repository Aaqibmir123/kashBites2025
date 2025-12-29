import {BASE_URL, Profile} from "../constants/resturants/endPoints.js";
import { getAuthHeaders } from "../authHeader.js";

export const getResturantProfileApi = async () => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${Profile.getProfile}`,
      {
        method: "GET",
        headers, // ✅ token only
      }
    );

    return await response.json();
  } catch (error) {
    console.error("User profile api error:", error);
    throw error;
  }
};

export const updateResturantProfileApi = async (formData) => {
  try {
    const headers = await getAuthHeaders(false); // ❗ FormData

    const response = await fetch(
      `${BASE_URL}${Profile.updateProfile}`,
      {
        method: "PUT",
        headers,
        body: formData,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Update profile api error:", error);
    throw error;
  }
};
