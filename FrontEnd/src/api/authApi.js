import { BASE_URL, AUTH } from "./constants/endpoints.js";

export const sendOtpApi = async (phone) => {
  try {
    const res = await fetch(BASE_URL + AUTH.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
  }
};

export const verifyOtpApi = async (phone, otp) => {

  const res = await fetch(BASE_URL + AUTH.VERIFY_OTP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, otp }),
  });

  return await res.json();
};

