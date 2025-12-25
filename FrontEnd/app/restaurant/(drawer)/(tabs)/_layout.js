import { Tabs } from "expo-router/tabs";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function TabsLayout() {
  const navigation = useNavigation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ❌ HEADER OFF
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      }}
    >
     

      {/* HOME TAB */}
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />

      {/* ORDERS */}
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="acceptedorders"
        options={{
          tabBarLabel: "Accepted",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ReadyOrders"
        options={{
          tabBarLabel: "Ready",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="OrderHistory"
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="RejectedOrders"
        options={{
          tabBarLabel: "Rejected",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-product"
        options={{
          tabBarLabel: "Add Product",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="inbox" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
