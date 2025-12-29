import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAdminOrdersApi } from "../../../src/api/admin/orderNotification";
import { BASE_IMAGE_URL } from "../../../src/api/apiConfig.js"
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function AdminOrderDetail() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await getAdminOrdersApi(orderId);
      setOrder(res.data[0]);
    } catch (err) {
      console.log("Order detail error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>No order found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* ===== STATUS CARD ===== */}
      <View style={styles.statusCard}>
        <View>
          <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
          <Text style={styles.date}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>
        </View>

        <View style={[styles.statusBadge, styles[`status_${order.status}`]]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      {/* ===== CUSTOMER CARD ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Customer Details</Text>

        <View style={styles.row}>
          <Ionicons name="person-outline" size={18} color="#555" />
          <Text style={styles.rowText}>{order.address.name}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="call-outline" size={18} color="#555" />
          <Text style={styles.rowText}>{order.address.phone}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={18} color="#555" />
          <Text style={styles.rowText}>{order.address.address}</Text>
        </View>
      </View>

      {/* ===== PRODUCT CARD ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order Item</Text>

        <View style={styles.productRow}>
          <Image
            source={{ uri: `${BASE_IMAGE_URL}${order.product.image}` }}
            style={styles.productImage}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{order.product.name}</Text>

            <Text style={styles.productQty}>Quantity: {order.product.qty}</Text>
          </View>

          <Text style={styles.price}>₹{order.product.price}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  statusCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  orderId: {
    fontSize: 16,
    fontWeight: "600",
  },

  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  status_Pending: {
    backgroundColor: "#ff9800",
  },

  status_Accepted: {
    backgroundColor: "#4caf50",
  },

  status_Rejected: {
    backgroundColor: "#f44336",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  rowText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
  },

  productQty: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ff6b00",
  },
});
