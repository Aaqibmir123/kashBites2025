import { BASE_URL, Profile } from "../constants/admin/endPoints.js";
import { getAuthHeaders } from "../authHeader.js";

/* ================= GET ADMIN PROFILE ================= */
export const getAdminProfileApi = async () => {
  try {
    const headers = await getAuthHeaders(true); // ✅ token only

    const response = await fetch(
      `${BASE_URL}${Profile.getProfile}`,
      {
        method: "GET",
        headers,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Admin profile api error:", error);
    throw error;
  }
};

/* ================= UPDATE ADMIN PROFILE ================= */
export const updateAdminProfileApi = async (formData) => {
  try {
    // ❗ EXACTLY like USER
    const headers = await getAuthHeaders(false); // ❌ no Content-Type

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
    console.error("Update admin profile api error:", error);
    throw error;
  }
};
