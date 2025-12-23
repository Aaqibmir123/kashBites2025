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
        options={{ title: "Cart", headerShown:false }}
      />

          <Stack.Screen 
        name="addAddress"
        options={{ 
          title: "Delivery Address",
          headerShown: false,
        }}
      />
      
      {/* 3. checkout.js: Final Step
        The back button will automatically go back to addAddress.js.
      */}
      <Stack.Screen 
        name="checkouts"
        options={{ 
          title: "Payment",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
