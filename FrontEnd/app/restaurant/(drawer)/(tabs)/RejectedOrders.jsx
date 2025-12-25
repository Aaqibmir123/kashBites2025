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
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints";
import AppHeader from "../../../../src/components/AppHeaderIcon";

export default function RejectedOrders() {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);



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
      const res = await getRestaurantOrdersApi(user.restaurantId, "Rejected");

      if (res?.success) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Rejected orders error:", error);
    } finally {
      setLoading(false);
    }
  };

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
      ListEmptyComponent={<Text style={styles.empty}>No Rejected Orders</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* TOP */}
          <View style={styles.topRow}>
            <Text style={styles.customer}>{item.address?.name}</Text>
            <Text style={styles.status}>REJECTED</Text>
          </View>

          {/* ADDRESS */}
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={14} />
            <Text style={styles.address}>{item.address?.address}</Text>
          </View>

          {/* PRODUCT */}
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

          {/* REJECT REASON */}
          <Text style={styles.reason}>
            ❌ Reason: {item.rejectReason || "Not specified"}
          </Text>

          {/* TIME */}
          <Text style={styles.time}>
            🕒 {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      )}
    />
   </View>
  );
}

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
  },
  customer: {
    fontWeight: "bold",
    fontSize: 15,
  },
  status: {
    color: "red",
    fontWeight: "bold",
    fontSize: 12,
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  address: {
    marginLeft: 6,
    fontSize: 13,
    color: "#444",
  },
  row: {
    flexDirection: "row",
    marginTop: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  product: {
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    color: "green",
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
