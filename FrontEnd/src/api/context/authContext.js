import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { jwtDecode } from "jwt-decode";
import { storeToken, getToken, removeToken } from "../utils/Storage.js";
import { sendOtpApi, verifyOtpApi } from "../../../src/api/authApi.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= RESTORE SESSION ================= */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await getToken();
        console.log("TOKEN FROM STORAGE:", savedToken);

        if (savedToken) {
          const decoded = jwtDecode(savedToken);
          console.log("DECODED TOKEN:", decoded);

          const userId =
            decoded.userId ||
            decoded._id ||
            decoded.id ||
            decoded.uid;

          const restId =
            decoded.restaurantId ||
            decoded.restId ||
            decoded.rid ||
            null;

          setToken(savedToken);
          setUser({
            _id: userId,
            phone: decoded.phone,
            role: decoded.role,
            restaurantId: restId,
          });
        }
      } catch (err) {
        console.log("FAILED TO RESTORE SESSION:", err);
        await removeToken();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /* ================= SEND OTP ================= */
  const login = async (phone) => {
    try {
      return await sendOtpApi(phone);
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      return { success: false };
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async ({ phone, otp }) => {
    try {
      const response = await verifyOtpApi(phone, otp);

      if (response.success) {
        const u = response.user;

        setUser({
          _id: u._id,
          phone: u.phone,
          role: u.role,
          restaurantId: u.restaurantId || null,
        });

        setToken(response.token);
        await storeToken(response.token);
      }

      return response;
    } catch (error) {
      console.log("VERIFY OTP ERROR:", error);
      return { success: false };
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await removeToken();
    setToken(null);
    setUser(null);
    Alert.alert("Logged out successfully");
  };

  /* ================= UPDATE USER ================= */
  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  /* 🔴 IMPORTANT FIX */
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        verifyOtp,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
