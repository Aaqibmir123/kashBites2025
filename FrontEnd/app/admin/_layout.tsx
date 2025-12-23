import { Drawer } from "expo-router/drawer";
import CustomAdminDrawer from "@/src/components/admin/CustomAdminDrawer";

export default function AdminLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomAdminDrawer {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 🔥 Tabs are MAIN screen */}
      <Drawer.Screen name="(tabs)" options={{ title: "Admin" }} />
      <Drawer.Screen name="logout" options={{ title: "Logout" }} />
    </Drawer>
  );
}
