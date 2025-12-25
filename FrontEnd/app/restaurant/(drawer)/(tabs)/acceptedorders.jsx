import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  getRestaurantOrdersApi,
  updateOrderStatusApi,
} from "../../../../src/api/resturants/orders";
import { AuthContext } from "../../../../src/api/context/authContext";
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints";
import { useFocusEffect } from "@react-navigation/native";
import AppHeader from "../../../../src/components/AppHeaderIcon";

export default function AcceptedOrders() {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ACCEPTED ORDERS ================= */
  useFocusEffect(
    useCallback(() => {
      if (user?.restaurantId) {
        fetchAcceptedOrders();
      }
    }, [user])
  );

  const fetchAcceptedOrders = async () => {
    try {
      setLoading(true);

      const res = await getRestaurantOrdersApi(user.restaurantId, "Accepted");

      if (res?.success) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Accepted orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MARK AS READY ================= */
  const markAsReady = async (orderId) => {
    try {
      await updateOrderStatusApi(orderId, "Ready");
      fetchAcceptedOrders(); // refresh list
    } catch (error) {
      console.log("Mark as ready error:", error);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
      <AppHeader  />

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 14 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No Accepted Orders</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* ===== TOP ROW ===== */}
            <View style={styles.topRow}>
              <View>
                <Text style={styles.customer}>{item.address?.name}</Text>
                <Text style={styles.phone}>📞 {item.address?.phone}</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>ACCEPTED</Text>
              </View>
            </View>

            {/* ===== ADDRESS ===== */}
            <View style={styles.addressBox}>
              <Ionicons name="location-outline" size={14} color="#444" />
              <Text style={styles.address}>{item.address?.address}</Text>
            </View>

            {/* ===== PRODUCT ===== */}
            <View style={styles.row}>
              <Image
                source={{
                  uri: item.product?.image
                    ? BASE_IMAGE_URL + item.product.image
                    : "https://via.placeholder.com/60",
                }}
                style={styles.image}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.product}>
                  {item.product?.name} × {item.product?.qty}
                </Text>
                <Text style={styles.price}>₹{item.product?.price}</Text>
              </View>
            </View>

            {/* ===== ACTION ===== */}
            <TouchableOpacity
              style={styles.readyBtn}
              onPress={() => markAsReady(item._id)}
            >
              <Ionicons name="checkmark-done" size={18} color="#fff" />
              <Text style={styles.readyText}> Mark as Ready</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customer: {
    fontWeight: "bold",
    fontSize: 15,
  },
  phone: {
    color: "#555",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#e0f2ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#0a7cff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  address: {
    marginLeft: 6,
    color: "#444",
    fontSize: 13,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
  },
  product: {
    fontWeight: "600",
    fontSize: 14,
  },
  price: {
    marginTop: 6,
    color: "green",
    fontWeight: "bold",
  },
  readyBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a7cff",
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  readyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
    fontSize: 14,
  },
});
