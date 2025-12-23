import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"  // profile/index.js
        options={{
          title: "Profile",
          headerShown: false,  // ✅ header + back button
        }}
      />
    </Stack>
  );
}
