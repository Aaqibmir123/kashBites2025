import { BASE_URL, Products,GetAllProducts,Restaurant } from "../constants/user/endpoints";
import { getAuthHeaders } from "../authHeader";


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

export const getAllProductsApi = async () => {
  try {
    const response = await fetch(`${BASE_URL}${GetAllProducts.getAllProducts}`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

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