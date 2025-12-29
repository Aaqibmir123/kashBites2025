import { BASE_URL, Address } from "../constants/user/endpoints";
import { getAuthHeaders } from "../authHeader";

export const addAddressApi = async (addressData) => {
  try {
    const headers = await getAuthHeaders(true);

    const res = await fetch(
      BASE_URL + Address.addAddress,
      {
        method: "POST",
        headers: {
          ...headers, // ✅ keep Authorization
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      }
    );

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("Add Address API Error:", err);
    throw err;
  }
};
