import React, { useState, useCallback, useContext } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

import {
  getRestaurantOrdersApi,
  updateOrderStatusApi,
} from "../../../../src/api/resturants/orders";
import { AuthContext } from "../../../../src/api/context/authContext";
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints";
import AppHeader from "../../../../src/components/AppHeaderIcon";

export default function ReadyOrders() {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH READY ORDERS ================= */



useFocusEffect(
  useCallback(() => {
    if (user?.restaurantId) {
      fetchReadyOrders();
    }
  }, [user])
);



  const fetchReadyOrders = async () => {
    try {
      setLoading(true);

      const res = await getRestaurantOrdersApi(
        user.restaurantId,
        "Ready"
      );

      if (res?.success) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Ready orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MARK AS DELIVERED ================= */
  const markAsDelivered = async (orderId) => {
    try {
      await updateOrderStatusApi(orderId, "Delivered");
      fetchReadyOrders(); // refresh list
    } catch (error) {
      console.log("Mark delivered error:", error);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View> 
      <AppHeader/>
      <FlatList
      data={orders}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 14 }}
      ListEmptyComponent={
        <Text style={styles.empty}>No Ready Orders</Text>
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
              <Text style={styles.statusText}>READY</Text>
            </View>
          </View>

          {/* ===== ADDRESS ===== */}
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={14} color="#444" />
            <Text style={styles.address}>
              {item.address?.address}
            </Text>
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
              <Text style={styles.price}>
                ₹{item.product?.price}
              </Text>
            </View>
          </View>

          {/* ===== ACTION ===== */}
          <TouchableOpacity
            style={styles.deliveredBtn}
            onPress={() => markAsDelivered(item._id)}
          >
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.deliveredText}>
              {" "}Mark as Delivered
            </Text>
          </TouchableOpacity>
        </View>
      )}
    /></View>
   
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
    backgroundColor: "#e8f8ef",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#2e7d32",
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
  deliveredBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  deliveredText: {
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
