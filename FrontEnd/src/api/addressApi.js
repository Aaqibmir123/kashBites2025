import {BASE_URL,Address} from "./constants/endpoints.js";

export const addAddressApi = async (addressData) => {
  try {
    const res = await fetch(BASE_URL + Address.addAdress, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData)
        });
    const data = await res.json();
    console.log("Add Address Response:", data);
    return data;
  }

    catch (err) {
    console.error("Add Address API Error:", err);
  }     
}