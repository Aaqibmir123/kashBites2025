import { Drawer } from "expo-router/drawer";
import CustomAdminDrawer from "../../../src/components/admin/CustomAdminDrawer";

export default function AdminLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomAdminDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,   // ❌ swipe OFF
        drawerType: "front",
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Admin" }} />
      <Drawer.Screen name="logout" options={{ title: "Logout" }} />
    </Drawer>
  );
}
