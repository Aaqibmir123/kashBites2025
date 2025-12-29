import React, { useEffect, useState, useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { AuthContext } from "../api/context/authContext";
import { getUserUnreadNotificationCount } from "../api/user/userNotification";
import { getResturantUnreadNotificationCount } from "../api/resturants/notification";

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [count, setCount] = useState(0);

  /* ===============================
     FETCH UNREAD COUNT (ROLE BASED)
  ================================ */
  const fetchUnreadCount = async () => {
    try {
      let res;

      if (user?.role === "user") {
        res = await getUserUnreadNotificationCount();
      } else if (user?.role === "restaurant") {
        res = await getResturantUnreadNotificationCount();
      }

      if (res?.success) {
        setCount(res.count);
      }
    } catch (err) {
      console.log("❌ Unread count error:", err.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
  }, [user]);

  /* ===============================
     NAVIGATION (ROLE BASED)
  ================================ */
  const handlePress = () => {
    if (user?.role === "user") {
      router.push("/user/(drawer)/notifications");
    } else if (user?.role === "restaurant") {
      router.push("/restaurant/(drawer)/notifications");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Ionicons name="notifications-outline" size={24} color="#000" />

      {/* 🔴 UNREAD BADGE */}
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ===============================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "tomato",
    borderRadius: 10,
    minWidth: 18,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});
