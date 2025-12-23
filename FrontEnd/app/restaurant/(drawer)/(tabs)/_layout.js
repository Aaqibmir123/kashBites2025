import { Tabs } from "expo-router/tabs";
import { AntDesign,Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function TabsLayout() {
  const navigation = useNavigation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      }}
    >
      {/* 🔥 DRAWER ICON TAB */}
      <Tabs.Screen
        name="drawer"
        options={{
          title: "",
          tabBarIcon: () => (
            <Ionicons name="menu" size={26} color="tomato" />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();          // ❌ route change
            navigation.openDrawer();    // ✅ open drawer
          },
        }}
      />

      {/* HOME TAB */}
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Home",
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />

      {/* ORDERS TAB */}
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: "Orders",
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />

      {/* ADD PRODUCT TAB */}
      <Tabs.Screen
        name="add-product"
        options={{
          tabBarLabel: "Add Product",
          title: "Add Products",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="inbox" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
