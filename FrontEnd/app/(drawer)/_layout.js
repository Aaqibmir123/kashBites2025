import { Drawer } from "expo-router/drawer";
import CustomDrawer from "./CustomDrawer";
export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, // Drawer ka header hide
        drawerPosition: "right",
        drawerStyle: { width: "100%" },
        drawerType: "front",
        overlayColor: "rgba(0,0,0,0.5)",
      }}
    >
      <Drawer.Screen name="(tabs)" />
      {/* Nested Stack for profile/support */}
      <Drawer.Screen
        name="profile"
        options={{ headerShown: false }} 
      />
    </Drawer>
  );
}
