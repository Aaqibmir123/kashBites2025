import { BASE_URL, Products } from "./constants/endpoints.js";

export const addProductApi = async (product) => {
  try {
    const response = await fetch(BASE_URL + Products.addProduct, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`API Error in addProductApi: ${err.message}`);
  }
};