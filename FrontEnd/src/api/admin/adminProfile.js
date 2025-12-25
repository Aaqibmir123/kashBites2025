import { BASE_URLL,AdminProfile } from "../constants/admin/endPoints.js";

export const getAdminProfileApi = async ({userId}) => { 
  try {
    const response = await fetch(BASE_URLL + AdminProfile.getProfile, {   
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
    catch (err) {
    throw new Error(`API Error in getProfileApi: ${err.message}`);
    }
};



export const updateAdminProfileApi = async (formData) => {
  try {
    const response = await fetch(BASE_URLL+ AdminProfile.updateProfile, {
      method: "POST",  
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Update failed");
    }

    return data;

  } catch (err) {
    throw new Error(`API Error in updateProfileApi: ${err.message}`);
  }
};

