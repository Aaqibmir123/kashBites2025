import { Stack } from "expo-router";

export default function CartLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Cart", headerShown: false }}
      />

      <Stack.Screen
        name="addAddress"
        options={{
          title: "Delivery Address",
          headerShown: false,
        }}
      />

     
      <Stack.Screen
        name="payment"
        options={{
          title: "Payment",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
