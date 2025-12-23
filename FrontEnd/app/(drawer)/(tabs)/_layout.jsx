import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function TabsLayout() {
  const navigation = useNavigation();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
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

      <Tabs.Screen
        name="cart" 
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24 }}>
              <Ionicons name="cart-outline" size={size} color={color} />
             
            </View>
          ),
        }}
      />

      {/* MENU (Drawer opener) */}
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarButton: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="menu" size={26} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* HIDE CHECKOUT STACK */}
      <Tabs.Screen
        name="(checkout-stack)"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
