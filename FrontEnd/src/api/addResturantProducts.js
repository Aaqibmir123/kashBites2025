import { BASE_URL, RestaurantProduct ,AllProducts} from "./constants/endpoints";

export const addResturantProductsApi = async (productData) => {
  try {
    const response = await fetch(`${BASE_URL}${RestaurantProduct.addProduct}`, {
      method: "POST",
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
    const response = await fetch(`${BASE_URL}${RestaurantProduct.getProducts}${restaurantId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ restaurantId }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const updateResturantProductApi = async (productId, productData) => {
  console.log("Updating product with ID:", productId);
  console.log("Product Data:", productData);
  try {
    const response = await fetch(
      `${BASE_URL}${RestaurantProduct.updateProduct}${productId}`,
      {
        method: "PUT",
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

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/delete-product/${productId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  } 
};

export const getAllProductsApi = async () => {
  try {
    const response = await fetch(`${BASE_URL}${AllProducts.getAllProducts}`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

export const getSingleProductApi = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}${AllProducts.getSingleProduct}${productId}`, {  
      method: "GET",
    });
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error fetching single product:", error);
    throw error;
  }
};


