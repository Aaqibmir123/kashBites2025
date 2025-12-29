import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import {
  getAdminNotificationsApi,
  markAdminNotificationReadApi,
} from "../../../src/api/admin/notifications.js";

export default function AdminNotifications() {
  const router = useRouter();
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ================= FETCH NOTIFICATIONS ================= */

  const fetchNotifications = async () => {
    try {
      const res = await getAdminNotificationsApi();
      console.log("Admin notifications fetched:", res);
      setNotifications(res.data || []);
    } catch (err) {
      console.log("Admin notification error:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* ================= PULL TO REFRESH ================= */

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  /* ================= UNREAD COUNT ================= */

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ================= HANDLE CLICK ================= */

 const handleNotificationClick = async (item) => {
  try {
    // already read → just navigate later
    if (item.read) {
      // router.push(`/admin/orders/${item.orderId}`);
      return;
    }

    const res = await markAdminNotificationReadApi(item._id);

    // ✅ response check
    if (!res?.success) {
      throw new Error("Failed to mark notification as read");
    }

    // ✅ local update ONLY after success
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === item._id ? { ...n, read: true } : n
      )
    );

    // open order detail
    // router.push(`/admin/orders/${item.orderId}`);
  } catch (err) {
    console.log("Mark read error:", err.message);
  }
};


  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.unreadCard]}
      onPress={() => handleNotificationClick(item)}
      activeOpacity={0.8}
    >
      <Ionicons
        name="notifications-outline"
        size={22}
        color="#ff6b00"
        style={{ marginRight: 10 }}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        >
          <View>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="#111"
            />

            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* ================= LIST ================= */}
      {!notifications.length ? (
        <View style={styles.center}>
          <Ionicons
            name="notifications-off-outline"
            size={60}
            color="#aaa"
          />
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ff6b00"]}
            />
          }
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: "center",
  },

  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b00",
  },

  message: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },

  time: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff6b00",
  },

  emptyText: {
    marginTop: 10,
    color: "#777",
    fontSize: 15,
  },
});
