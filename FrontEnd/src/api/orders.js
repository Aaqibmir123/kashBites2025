import { BASE_URL,Order } from "./constants/endpoints";

export const PlaceOrder = async (orderData) => {
  try {
    const response = await fetch(`${BASE_URL}${Order.placeOrder}`, {    
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    });
    return await response.json();
    } catch (error) {   
        console.error("Error placing order:", error);
        throw error;
    }
};

export const GetUserOrders = async (userId) => {
  console.log(userId,'apii')
  try {
    const response = await fetch(
      `${BASE_URL}${Order.getOrders}/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

