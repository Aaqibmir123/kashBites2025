import { Tabs } from "expo-router/tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function TabsLayout() {
  const navigation = useNavigation();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* 🔥 DRAWER TAB */}
      <Tabs.Screen
        name="drawer"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" size={26} color="#FF6347" />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // ❌ route change
            navigation.openDrawer(); // ✅ open drawer
          },
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="SupportScreen"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add-restaurant"
        options={{
          title: "Add Restaurant",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
