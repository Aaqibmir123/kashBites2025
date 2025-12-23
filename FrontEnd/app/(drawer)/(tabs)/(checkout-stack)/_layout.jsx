import { Stack } from 'expo-router';

export default function CheckoutStackLayout() {
  return (
    <Stack>
      {/* 1. [id].js: Product Details Screen (Start of the Stack)
        This is the entry point for the sequential flow.
      */}
      <Stack.Screen 
        name="[id]"
        options={{ 
          title: "Product Details",
          headerShown: true,
        }}
      />
      
      {/* 2. addAddress.js: Sequential Step 2
        The back button will automatically go back to [id].js.
      */}
      <Stack.Screen 
        name="addAddress"
        options={{ 
          title: "Delivery Address",
          headerShown: true,
        }}
      />
      
      {/* 3. checkout.js: Final Step
        The back button will automatically go back to addAddress.js.
      */}
      <Stack.Screen 
        name="checkout"
        options={{ 
          title: "Payment",
          headerShown: true,
        }}
      />
    </Stack>
  );
}