import { useEffect, useContext } from "react";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";

import { AuthProvider, AuthContext } from "@/src/api/context/authContext";
import { CartProvider } from "@/src/api/context/CartContext";
import { CheckoutProvider } from "@/src/api/context/checkoutContext";
import { saveUserPushTokenApi } from "@/src/api/saveUserPushTokenApi";

/* 🔔 Notification handler (Expo latest) */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/* ================= APP INNER LAYOUT ================= */
function AppLayout() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?._id) {
      registerForPushNotifications();
    }
  }, [user]);

  const registerForPushNotifications = async () => {
    try {
      /* 1️⃣ Permission */
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("❌ Notification permission denied");
        return;
      }

      /* 2️⃣ Safe projectId */
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        console.log("❌ Project ID not found");
        return;
      }

      /* 3️⃣ Get Expo push token */
      const token = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      console.log("🔔 PUSH TOKEN:", token);

      /* 4️⃣ SAVE TOKEN USING API LAYER (IMPORTANT LINE) */
      await saveUserPushTokenApi(user._id, token);

    } catch (err) {
      console.log("Push notification error:", err);
    }
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
}

/* ================= ROOT PROVIDERS ================= */
export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <AppLayout />
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  );
}
