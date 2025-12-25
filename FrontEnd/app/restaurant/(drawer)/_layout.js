import { Drawer } from "expo-router/drawer";
import CustomRestaurantDrawer from "../../../src/components/Resturant/CustomRestaurantDrawer";

export default function RestaurantDrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomRestaurantDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",

        // optional (recommended)
        drawerType: "front",
        drawerStyle: {
          width: "100%",
        },
      }}
    >
    </Drawer>
  );
}
