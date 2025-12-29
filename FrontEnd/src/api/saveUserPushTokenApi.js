import { BASE_URL, AUTH } from "./constants/user/endpoints";

export const saveUserPushTokenApi = async (userId, pushToken) => {
  try {
    const res = await fetch(`${BASE_URL}/${AUTH.SAVE_PUSH_TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        pushToken,
      }),
    });

    return await res.json();
  } catch (error) {
    console.log("❌ Save push token API error:", error);
    return { success: false };
  }
};
