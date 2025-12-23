import {BASE_URL, Restaurant} from './constants/endpoints';

export const addRestaurantApi = async (restaurantData) => {
  try {
    const response = await fetch(`${BASE_URL}${Restaurant.addRestaurant}`, {
      method: "POST",
      body: restaurantData, // ✅ FormData directly
      // ❌ DO NOT set Content-Type
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding restaurant:", error);
    throw error;
  }
};


export const getAllRestaurantsApi = async () => {
  try {
    const response = await fetch(`${BASE_URL}${Restaurant.getRestaurants}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

export const updateRestaurantApi = async (id, formData) => {
  try {
    const response = await fetch(
      `${BASE_URL}${Restaurant.updateRestaurant}${id}`,
      {
        method: "PUT",
        body: formData, // ✅ FormData directly
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating restaurant:", error);
    throw error;
  }
};


export const deleteRestaurantApi = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${Restaurant.deleteRestaurant}${id}`, {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error deleting restaurant:", error);
    throw error;
  }
};


