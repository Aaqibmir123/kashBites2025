import { BASE_URL, RestaurantProduct ,AllProducts } from "../constants/resturants/endPoints";
import { getAuthHeaders } from "../../api/authHeader";

/* ================= ADD PRODUCT ================= */
export const addResturantProductsApi = async (productData) => {
  try {
    const headers = await getAuthHeaders(false);

    const response = await fetch(`${BASE_URL}${RestaurantProduct.addProduct}`, {
      method: "POST",
      headers,          // ✅ token added
      body: productData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};


export const getProductsByRestaurantApi = async (restaurantId) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${RestaurantProduct.getProducts}/${restaurantId}`,
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
/* ================= UPDATE PRODUCT ================= */
export const updateResturantProductApi = async (productId, productData) => {
  try {
    const headers = await getAuthHeaders(false);

    const response = await fetch(
      `${BASE_URL}${RestaurantProduct.updateProduct}/${productId}`,
      {
        method: "PUT",
        headers,          // ✅ token added
        body: productData,
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (productId) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${RestaurantProduct.deleteProduct}/${productId}`,
      {
        method: "DELETE",
        headers, // ✅ token added
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

/* ================= GET SINGLE PRODUCT ================= */
export const getSingleProductApi = async (productId) => {
  try {
    const headers = await getAuthHeaders(true);

    const response = await fetch(
      `${BASE_URL}${AllProducts.getSingleProduct}${productId}`,
      {
        method: "GET",
        headers, // ✅ token added
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching single product:", error);
    throw error;
  }
};
