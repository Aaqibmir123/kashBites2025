import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import AppHeader from "../../../src/components/AppHeaderIcon";
import { AuthContext } from "../../../src/api/context/authContext";

import {
  getRestaurantNotificationsApi,
  markRestaurantNotificationReadApi,
} from "../../../src/api/resturants/restaurantNotificationApi.js";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  const restaurantId = user?.restaurantId;

  useEffect(() => {
    if (restaurantId) fetchNotifications();
  }, [restaurantId]);

  const fetchNotifications = async () => {
    const res = await getRestaurantNotificationsApi(restaurantId);
    if (res?.success) {
      setNotifications(res.data);
    }
  };

  const markAsRead = async (id) => {
    console.log(id,'readed')
    await markRestaurantNotificationReadApi(id);
    fetchNotifications(); 
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.read === false && styles.unread,
      ]}
      onPress={() => markAsRead(item._id)}
    >
      <Text style={styles.title}>
        {item.title || "New Notification"}
      </Text>

      <Text style={styles.message}>
        {item.message || "You have a new update"}
      </Text>

      {!item.read && <Text style={styles.badge}>NEW</Text>}
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
        ListEmptyComponent={
          <Text style={styles.empty}>No notifications</Text>
        }
      />
    </View>
  );
}

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

  unread: {
    borderLeftWidth: 4,
    borderLeftColor: "tomato",
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

  badge: {
    marginTop: 6,
    color: "tomato",
    fontSize: 11,
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
  },
});
