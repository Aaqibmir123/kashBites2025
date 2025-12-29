import { BASE_URL, Support } from "../constants/user/endpoints";
import { getAuthHeaders } from "../authHeader";

/* =========================================================
   1️⃣ GET / CREATE USER CONVERSATION
   ========================================================= */
export const GetUserConversation = async () => {
  try {
    const headers = await getAuthHeaders(false);

    const response = await fetch(`${BASE_URL}${Support.getConversation}`, {
      method: "GET",
      headers,
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching user conversation:", error);
    throw error;
  }
};

/* =========================================================
   2️⃣ SEND USER MESSAGE (TEXT + SINGLE / MULTIPLE IMAGES)
   ========================================================= */
export const SendUserMessage = async (formData) => {
  try {
    const headers = await getAuthHeaders(false);
    delete headers["Content-Type"]; // 🔥 MUST

    const response = await fetch(
      `${BASE_URL}${Support.sendMessage}`,
      {
        method: "POST",
        headers,
        body: formData, // 👈 DIRECT
      }
    );

    return await response.json();
  } catch (error) {
    throw error;
  }
};



/* =========================================================
   3️⃣ GET USER MESSAGES (CHAT HISTORY)
   ========================================================= */
export const GetUserMessages = async (conversationId) => {
  try {
    const headers = await getAuthHeaders(false);

    const response = await fetch(
      `${BASE_URL}${Support.getMessages}/${conversationId}`,
      {
        method: "GET",
        headers,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching user messages:", error);
    throw error;
  }
};
