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

export default function Order() {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const router = useRouter();

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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const d = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const t = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${d} • ${t}`;
  };

  /* 🔁 REORDER → ADDRESS PAGE (push so back works) */
  const handleReorder = (item) => {
    router.push({
      pathname: "/(tabs)/cart/addAddress",
      params: {
        from: "order",
        productId: item.product?.productId,
        productName: item.product?.name,
        productPrice: item.product?.price,
        productQty: item.product?.qty,
        productImage: item.product?.image,
        restaurantId: item.restaurantId,
      },
    });
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
          <View style={styles.card}>
            <Image
              source={{
                uri: item.product?.image
                  ? `${BASE_IMAGE_URL}${item.product.image}`
                  : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
              }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.product?.name}</Text>

              <Text style={styles.price}>₹ {item.product?.price}</Text>

              <Text style={styles.address}>📍 {item.address?.address}</Text>

              <Text style={styles.date}>
                Ordered on {formatDateTime(item.createdAt)}
              </Text>

              <TouchableOpacity
                style={styles.reorderBtn}
                onPress={() => handleReorder(item)}
              >
                <Ionicons
                  name="refresh"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "green",
    marginTop: 2,
  },
  address: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  reorderBtn: {
    marginTop: 10,
    backgroundColor: "#D81B60",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  reorderText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});
