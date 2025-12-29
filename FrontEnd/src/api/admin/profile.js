import { BASE_URL, ADMIN_PROFILE } from "../constants/admin/endPoints";
import { getAuthHeaders } from "../authHeader";

/* ================= GET ADMIN PROFILE ================= */
export const getAdminProfile = async () => {
  try {
    const headers = await getAuthHeaders(true); // ✅ token

    const response = await fetch(
      `${BASE_URL}${ADMIN_PROFILE.GET_PROFILE}`,
      {
        method: "GET", // ✅ GET
        headers,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error getting admin profile:", error);
    throw error;
  }
};

/* ================= UPDATE ADMIN PROFILE ================= */
export const updateAdminProfile = async (formData) => {
  try {
    const headers = await getAuthHeaders(false); // ❌ no content-type

    const response = await fetch(
      `${BASE_URL}${ADMIN_PROFILE.UPDATE_PROFILE}`,
      {
        method: "PUT", // ✅ PUT
        headers,
        body: formData,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error updating admin profile:", error);
    throw error;
  }
};
