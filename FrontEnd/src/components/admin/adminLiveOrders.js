import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

import { getAdminOrdersApi } from "../../api/admin/adminLiveOrders";
import { BASE_IMAGE_URL } from "../../../src/api/apiConfig.js"

const STATUSES = [
  "All",
  "Pending",
  "Accepted",
  "Ready",
  "Delivered",
  "Rejected",
];

export default function AdminOrders() {
  const [status, setStatus] = useState("All");
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const fetchOrders = async () => {
    const res = await getAdminOrdersApi(status);
    if (res?.success) setOrders(res.data);
  };

  const filteredOrders = orders.filter((o) =>
    `${o.restaurantName} ${o.productName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* IMAGE */}
        <Image
          source={{
            uri: item.productImage
              ? `${BASE_IMAGE_URL}${item.productImage}`
              : "https://via.placeholder.com/60",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* DETAILS */}
        <View style={styles.cardContent}>
          <Text style={styles.restaurant}>{item.restaurantName}</Text>
          <Text style={styles.product}>{item.productName}</Text>

          <View style={styles.row}>
            <Text style={styles.amount}>₹{item.totalAmount}</Text>

            <Text
              style={[
                styles.status,
                item.status === "Delivered" && styles.delivered,
                item.status === "Pending" && styles.pending,
                item.status === "Rejected" && styles.rejected,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <TextInput
        placeholder="Search restaurant / product"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* STATUS FILTER */}
      <View style={styles.filters}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setStatus(s)}
            style={[styles.filterBtn, status === s && styles.active]}
          >
            <Text style={{ color: status === s ? "#fff" : "#333" }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ORDERS LIST */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 12,
  },

  search: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 12,
    elevation: 2,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#eaeaea",
    marginRight: 8,
    marginBottom: 8,
  },

  active: {
    backgroundColor: "#FF6347",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
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
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  amount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },

  status: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    color: "#fff",
    overflow: "hidden",
  },

  delivered: {
    backgroundColor: "#2ecc71",
  },

  pending: {
    backgroundColor: "#f39c12",
  },

  rejected: {
    backgroundColor: "#e74c3c",
  },
});
