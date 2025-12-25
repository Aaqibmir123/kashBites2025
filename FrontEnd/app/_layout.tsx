import { Stack } from "expo-router";
import { AuthProvider } from "@/src/api/context/authContext";
import { CartProvider } from "@/src/api/context/CartContext";
import { CheckoutProvider } from "@/src/api/context/checkoutContext";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  );
}
