import { View, Text } from "react-native";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/src/api/context/authContext";
import { router } from "expo-router";

export default function Logout() {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const handleLogout = async () => {
      console.log("hello logout");
      await logout();

      router.replace("/auth/login");
    };

    handleLogout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Logging out...</Text>
    </View>
  );
}
