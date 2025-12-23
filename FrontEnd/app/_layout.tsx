import { Stack } from "expo-router";
import { AuthProvider } from "@/src/api/context/authContext";
import { CartProvider } from "@/src/api/context/CartContext";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </CartProvider>
    </AuthProvider>
  );
}
