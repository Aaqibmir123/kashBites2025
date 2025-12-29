import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "expo-router";

import { getAdminDashboardApi } from "../../../src/api/admin/adminDashboard";
import { BASE_IMAGE_URL } from "../../../src/api/apiConfig.js"
import AppHeader from "../../../src/components/AppHeaderIcon";

export default function Dashboard() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardApi();
      console.log("API RESPONSE:", res);

      // ✅ API returns ARRAY
      if (res?.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.log("Dashboard error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DATE + TIME FORMAT
  const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 60 }} />;
  }

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <AppHeader />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Commission Details</Text>

        {orders.length > 0 ? (
          orders.map((item) => (
            <View key={item.orderId} style={styles.orderCard}>
              {/* IMAGE */}
              <Image
                source={{
                  uri: item.productImage
                    ? `${BASE_IMAGE_URL}${item.productImage}`
                    : "https://via.placeholder.com/80",
                }}
                style={styles.productImage}
                resizeMode="cover"
              />

              {/* DETAILS */}
              <View style={styles.cardContent}>
                <Text style={styles.restaurant}>{item.restaurantName}</Text>

                <Text style={styles.product}>{item.productName}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.amount}>₹{item.totalAmount}</Text>

                  <Text style={styles.commission}>
                    Commission ₹{item.commissionAmount}
                  </Text>
                </View>

                <Text style={styles.date}>
                  {formatDateTime(item.deliveredAt)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No commission data available</Text>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },

  header: {
    height: 56,
    backgroundColor: "#FF6347",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111",
  },

  orderCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  restaurant: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
  },

  product: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  amount: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },

  commission: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6347",
  },

  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  emptyText: {
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
});
