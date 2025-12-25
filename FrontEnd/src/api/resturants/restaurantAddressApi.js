import { BASE_URL, RestaurantAddress } from "../constants/resturants/endPoints";

export const AddRestaurantAddress = async (data, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}${RestaurantAddress.addAddress}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    console.log("Create Restaurant API Error:", error);
    throw error;
  }
};

export const getRestaurantAddressByIdApi = async (restaurantId) => {
  try {
    const response = await fetch(
      `${BASE_URL}${RestaurantAddress.getRestaurantAddress}/${restaurantId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    console.log("Get Restaurant API Error:", error);
    throw error;
  }
};
