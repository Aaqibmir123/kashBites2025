import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useContext } from "react";

import { CartContext } from "@/src/api/context/CartContext";
import Badge from "@/src/components/Badge";

export default function TabsLayout() {
  const { cartQty } = useContext(CartContext);


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D81B60",
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ORDER */}
      <Tabs.Screen
        name="order"
        options={{
          title: "Order",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />

      {/* FAVOURITES */}
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />

      {/* CART (WITH BADGE ✅) */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24 }}>
              <Ionicons name="cart-outline" size={size} color={color} />
              <Badge count={cartQty} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
