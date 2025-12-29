import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import AppHeader from "../../../src/components/AppHeaderIcon.jsx";
import { AuthContext } from "../../../src/api/context/authContext.js";

import {
  getUserNotificationsApi,
  markUserNotificationAsRead,
  
  
} from "../../../src/api/user/userNotification.js";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(notifications.length,'notifications');

  /* ===============================
     FETCH USER NOTIFICATIONS
  ================================ */
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getUserNotificationsApi();

      if (res?.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.log("❌ Fetch user notifications error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  /* ===============================
     MARK AS READ
  ================================ */
  const markAsRead = async (notificationId) => {
    try {
      // ⚡ Optimistic UI
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );

      await markUserNotificationAsRead(notificationId);
    } catch (err) {
      console.log("❌ Mark read error:", err.message);
      fetchNotifications(); // fallback
    }
  };

  /* ===============================
     RENDER ITEM
  ================================ */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => markAsRead(item._id)}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {item.title || "New Notification"}
          </Text>

          <Text style={styles.message}>
            {item.message || "You have a new update"}
          </Text>
        </View>

        {/* 🔴 RED DOT (UNREAD ONLY) */}
        {!item.read && <View style={styles.redDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Notifications" />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        refreshing={loading}
        onRefresh={fetchNotifications}
        ListEmptyComponent={
          <Text style={styles.empty}>No notifications</Text>
        }
      />
    </View>
  );
}

/* ===============================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
  },

  message: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },

  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "tomato",
    marginLeft: 10,
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
  },
});
