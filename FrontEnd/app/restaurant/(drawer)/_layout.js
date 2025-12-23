import { Drawer } from "expo-router/drawer";
import CustomRestaurantDrawer from "../../../src/components/Resturant/CustomRestaurantDrawer";

export default function RestaurantDrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomRestaurantDrawer {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="logout" options={{ title: "Logout" }} />
    </Drawer>
  );
}
