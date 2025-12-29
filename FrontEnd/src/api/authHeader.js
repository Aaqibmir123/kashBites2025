import { getToken } from "./utils/Storage"; // path adjust

export const getAuthHeaders = async (isJson = true) => {
  const token = await getToken();
  console.log("📱 TOKEN FROM ASYNC STORAGE:", token);


  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};
