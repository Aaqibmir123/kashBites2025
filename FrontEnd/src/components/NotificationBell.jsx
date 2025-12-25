import { useEffect, useState, useContext } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { AuthContext } from "../api/context/authContext";
import { getRestaurantUnreadCountApi } from "../../src/api/resturants/restaurantNotificationApi";

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [count, setCount] = useState(0);

  const restaurantId = user?.restaurantId;

  const fetchUnreadCount = async () => {
    if (!restaurantId) return;
    const res = await getRestaurantUnreadCountApi(restaurantId);
    if (res?.success) setCount(res.count);
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [restaurantId]);

  return (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={() => router.push("/restaurant/(drawer)/notifications")}
    >
      <Ionicons name="notifications-outline" size={24} color="#000" />

      {count > 0 && (
        <View
          style={{
            position: "absolute",
            top: -4,
            right: -6,
            backgroundColor: "red",
            borderRadius: 10,
            paddingHorizontal: 5,
            minWidth: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10 }}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
