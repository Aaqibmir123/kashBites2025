import { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { getRestaurantOrdersApi } from "../../../../src/api/resturants/orders";
import { AuthContext } from "../../../../src/api/context/authContext";
import { BASE_IMAGE_URL } from "../../../../src/api/apiConfig";
import AppHeader from "../../../../src/components/AppHeaderIcon";

export default function RejectedOrders() {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH REJECTED ORDERS ================= */
  useFocusEffect(
    useCallback(() => {
      if (user?.restaurantId) {
        fetchRejectedOrders();
      }
    }, [user])
  );

  const fetchRejectedOrders = async () => {
    try {
      setLoading(true);
      const res = await getRestaurantOrdersApi("Rejected");

      if (res?.success) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("❌ Rejected orders error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
      <AppHeader />

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 14 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No Rejected Orders</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* ===== TOP ROW ===== */}
            <View style={styles.topRow}>
              <Text style={styles.customer}>{item.address?.name}</Text>
              <Text style={styles.status}>REJECTED</Text>
            </View>

            {/* ===== LOCATION ===== */}
            <View style={styles.addressBox}>
              <Ionicons name="location-outline" size={14} color="#444" />
              <Text style={styles.address}>
                {item.address?.house},{" "}
                {item.address?.village},{" "}
                {item.address?.pincode}
              </Text>
            </View>

            {/* ===== ITEMS ===== */}
            {item.items?.map((prod, index) => (
              <View key={index} style={styles.row}>
                <Image
                  source={{
                    uri: prod.image
                      ? BASE_IMAGE_URL + prod.image
                      : "https://via.placeholder.com/60",
                  }}
                  style={styles.image}
                />

                <Text style={styles.product}>
                  {prod.name} (Qty: {prod.qty})
                </Text>
              </View>
            ))}

            {/* ===== FINAL PRICE ===== */}
            <View style={styles.totalBox}>
              <Text style={styles.totalText}>
                Total Amount: ₹{item.totalAmount}
              </Text>
            </View>

            {/* ===== REJECT REASON ===== */}
            <Text style={styles.reason}>
              ❌ Reason: {item.rejectReason || "Not specified"}
            </Text>

            {/* ===== TIME ===== */}
            <Text style={styles.time}>
              🕒 {new Date(item.createdAt).toLocaleString()}
            </Text>
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
    elevation: 2,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  customer: {
    fontSize: 16,
    fontWeight: "700",
  },

  status: {
    color: "#c62828",
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
    fontSize: 13,
    color: "#444",
    flex: 1,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 10,
  },

  product: {
    fontSize: 14,
    fontWeight: "600",
  },

  totalBox: {
    marginTop: 12,
    alignItems: "flex-end",
  },

  totalText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },

  reason: {
    marginTop: 10,
    color: "#c62828",
    fontWeight: "500",
  },

  time: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
  },
});
