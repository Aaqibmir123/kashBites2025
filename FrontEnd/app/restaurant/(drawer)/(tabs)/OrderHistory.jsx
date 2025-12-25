import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getRestaurantOrdersApi } from "../../../../src/api/resturants/orders";
import { AuthContext } from "../../../../src/api/context/authContext";
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints";
import { useFocusEffect } from "@react-navigation/native";
import AppHeader from "../../../../src/components/AppHeaderIcon";

export default function DeliveredOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DELIVERED ORDERS ================= */

  useFocusEffect(
    useCallback(() => {
      if (user?.restaurantId) {
        fetchDeliveredOrders();
      }
    }, [user])
  );

  const fetchDeliveredOrders = async () => {
    try {
      setLoading(true);

      const res = await getRestaurantOrdersApi(user.restaurantId, "Delivered");

      if (res?.success) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Delivered orders error:", error);
    } finally {
      setLoading(false);
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
          <Text style={styles.empty}>No Delivered Orders</Text>
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
                <Text style={styles.statusText}>DELIVERED</Text>
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

            {/* ===== FOOTER ===== */}
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
    backgroundColor: "#f9f9f9",
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
    fontWeight: "bold",
    fontSize: 15,
  },
  phone: {
    color: "#555",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#555",
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
  time: {
    marginTop: 10,
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
    fontSize: 14,
  },
});
