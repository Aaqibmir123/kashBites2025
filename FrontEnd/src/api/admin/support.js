import { BASE_URL } from "../constants/admin/endPoints";
import { getAuthHeaders } from "../authHeader";

/* LIST */
export const GetAdminConversations = async () => {
  const headers = await getAuthHeaders(false);
  const res = await fetch(`${BASE_URL}/support/conversations`, {
    headers,
  });
  return res.json();
};

/* CHAT */
export const GetAdminMessages = async (conversationId) => {
  const headers = await getAuthHeaders(false);
  const res = await fetch(
    `${BASE_URL}/support/messages/${conversationId}`,
    { headers }
  );
  return res.json();
};

export const SendAdminMessage = async (formData) => {
  const headers = await getAuthHeaders(false);
  delete headers["Content-Type"];

  const res = await fetch(`${BASE_URL}/support/send-message`, {
    method: "POST",
    headers,
    body: formData,
  });
  return res.json();
};
