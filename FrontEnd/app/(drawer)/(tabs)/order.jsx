import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../src/api/context/authContext";
import { GetUserOrders } from "../../../src/api/orders";
import { BASE_IMAGE_URL } from "../../../src/api/constants/endpoints";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCheckout } from "../../../src/api/context/checkoutContext";

export default function Order() {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const router = useRouter();

  const { setBilling, calculateBill } = useCheckout(); // ✅ FIXED

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await GetUserOrders(userId);
      setOrders(res.orders || []);
    } catch (err) {
      console.log("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 REORDER (FINAL WORKING) */
 const handleReorder = (order) => {
  // 1️⃣ items context me daalo
  setBilling((prev) => ({
    ...prev,
    cartItems: order.items,
    itemTotal: order.itemTotal,
    isReorder: true,        // 🔥 flag
  }));

  calculateBill({
    itemTotal: order.itemTotal,
  });

  // 2️⃣ review page par bhejo
  router.push("/(tabs)/cart/reviewOrder"); // ✅ YAHI USE HOGA
};


  if (!userId) {
    return (
      <View style={styles.center}>
        <Text>Please login to view orders</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D81B60" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No orders found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            {/* HEADER */}
            <View style={styles.headerRow}>
              <Text style={styles.orderId}>
                Order ID: {item._id.slice(-6)}
              </Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>

            {/* ITEMS */}
            {item.items.map((prod) => (
              <View key={prod._id} style={styles.itemRow}>
                <Image
                  source={{
                    uri: prod.image
                      ? `${BASE_IMAGE_URL}${prod.image}`
                      : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
                  }}
                  style={styles.image}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{prod.name}</Text>
                  <Text style={styles.qty}>Qty: {prod.qty}</Text>
                </View>

                <Text style={styles.price}>₹ {prod.price}</Text>
              </View>
            ))}

            {/* TOTAL + REORDER */}
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Paid</Text>
                <Text style={styles.totalPrice}>₹ {item.totalAmount}</Text>
              </View>

              <TouchableOpacity
                style={styles.reorderBtn}
                onPress={() => handleReorder(item)}
              >
                <Ionicons name="refresh" size={14} color="#fff" />
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  orderId: { fontSize: 12, fontWeight: "600", color: "#555" },
  date: { fontSize: 12, color: "#777" },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  name: { fontSize: 15, fontWeight: "600" },
  qty: { fontSize: 12, color: "#555" },
  price: { fontSize: 14, fontWeight: "700", color: "#2E7D32" },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 8,
    marginTop: 6,
  },

  totalLabel: { fontSize: 14, fontWeight: "700" },
  totalPrice: { fontSize: 15, fontWeight: "800", color: "#D81B60" },

  reorderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D81B60",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  reorderText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },
});
