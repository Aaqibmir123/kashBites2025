import React, { useCallback, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../../../../src/api/context/authContext";
import {
  getRestaurantOrdersApi,
  updateOrderStatusApi,
} from "../../../../src/api/resturants/orders";
import { BASE_IMAGE_URL } from "../../../../src/api/apiConfig";
import AppHeader from "../../../../src/components/AppHeaderIcon";

export default function Orders() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===============================
     FETCH ORDERS
  ================================ */
  useFocusEffect(
    useCallback(() => {
      if (user) fetchOrders();
    }, [user])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getRestaurantOrdersApi("Pending");
      setOrders(res?.data || []);
    } catch (error) {
      console.log("Fetch orders error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UPDATE STATUS
  ================================ */
  const updateStatus = async (orderId, status) => {
    try {
      await updateOrderStatusApi(orderId, status);
      fetchOrders();
    } catch (error) {
      console.log("Update status error:", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ================= HEADER ================= */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <AppHeader title="Orders" />
      </TouchableOpacity>

      {/* ================= LIST ================= */}
      {!orders.length ? (
        <View style={styles.center}>
          <Text>No new orders</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 14 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* ===== CUSTOMER ===== */}
              <Text style={styles.customer}>{item.address?.name}</Text>
              <Text style={styles.phone}>📞 {item.address?.phone}</Text>

              {/* ===== ADDRESS ===== */}
              <View style={styles.addressBox}>
                <Ionicons name="location-outline" size={16} color="#444" />
                <Text style={styles.addressText}>
                  {item.address?.house}, {item.address?.village},{" "}
                  {item.address?.pincode}
                </Text>
              </View>

              {/* ===== ITEMS (NO PRICE CONFUSION) ===== */}
              {item.items.map((prod) => (
                <View key={prod._id} style={styles.productRow}>
                  <Image
                    source={{ uri: `${BASE_IMAGE_URL}${prod.image}` }}
                    style={styles.productImage}
                  />

                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{prod.name}</Text>
                    <Text style={styles.productQty}>
                      Qty: {prod.qty}
                    </Text>
                  </View>
                </View>
              ))}

              {/* ===== FINAL TOTAL (ONLY THIS PRICE) ===== */}
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>₹{item.totalAmount}</Text>
              </View>

              {/* ===== STATUS ===== */}
              <View style={styles.statusRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>

              {/* ===== ACTION BUTTONS ===== */}
              <View style={styles.actionsRow}>
                {item.status === "Pending" && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.accept]}
                      onPress={() => updateStatus(item._id, "Accepted")}
                    >
                      <Text style={styles.actionText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.reject]}
                      onPress={() => updateStatus(item._id, "Rejected")}
                    >
                      <Text style={styles.actionText}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}

                {item.status === "Accepted" && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.ready]}
                    onPress={() => updateStatus(item._id, "Ready")}
                  >
                    <Text style={styles.actionText}>Ready</Text>
                  </TouchableOpacity>
                )}

                {item.status === "Ready" && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.delivered]}
                    onPress={() => updateStatus(item._id, "Delivered")}
                  >
                    <Text style={styles.actionText}>Delivered</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },

  customer: {
    fontSize: 16,
    fontWeight: "700",
  },

  phone: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  addressText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#444",
    flex: 1,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
  },

  productQty: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  totalBox: {
    marginTop: 12,
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },

  totalLabel: {
    color: "#ccc",
    fontSize: 12,
  },

  totalAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },

  statusRow: {
    marginTop: 10,
    alignItems: "flex-end",
  },

  badge: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 12,
    color: "#333",
  },

  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },

  actionBtn: {
    width: "32%",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginRight: "2%",
    marginBottom: 8,
  },

  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  accept: { backgroundColor: "#2e7d32" },
  reject: { backgroundColor: "#c62828" },
  ready: { backgroundColor: "#f9a825" },
  delivered: { backgroundColor: "#1565c0" },
});
