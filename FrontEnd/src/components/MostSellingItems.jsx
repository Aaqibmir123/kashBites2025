import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getAllProductsApi } from "../api/user/productsApi.js";
import { BASE_IMAGE_URL } from "../api/apiConfig.js";
import ProductBottomModal from "../components/Resturant/ProductBottomModal.jsx";

export default function MostSellingItems() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProductsApi(); // 👈 later replace with mostSelling API
        if (res?.success) {
          setProducts(res.data || []);
        }
      } catch (e) {
        console.log("API error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= PRICE ================= */
  const getDisplayPrice = (item) => {
    if (item.pricingType === "single") return `₹${item.price}`;
    if (item.variants?.length) {
      const prices = item.variants.map((v) => Number(v.price));
      return `From ₹${Math.min(...prices)}`;
    }
    return "₹0";
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  /* ================= PRODUCT CARD ================= */
  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.image
            ? `${BASE_IMAGE_URL}${item.image}`
            : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
        }}
        style={styles.image}
      />

      {/* ❤️ FAVORITE */}
      <TouchableOpacity style={styles.heartBtn}>
        <Ionicons name="heart-outline" size={18} color="#111" />
      </TouchableOpacity>

      {/* ➕ ADD */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setSelectedProduct(item);
          setShowModal(true);
        }}
      >
        <Text style={styles.addText}>ADD</Text>
      </TouchableOpacity>

      {/* RESTAURANT */}
      <View style={styles.restaurantRow}>
        <Ionicons name="restaurant-outline" size={12} color="#666" />
        <Text style={styles.restaurantName} numberOfLines={1}>
          {item.restaurantName || "Al-Aith Restaurant"}
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {item.name}
      </Text>

      <Text style={styles.price}>{getDisplayPrice(item)}</Text>
    </View>
  );

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Most Selling Items</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* MODAL */}
      <ProductBottomModal
        visible={showModal}
        product={selectedProduct}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4", // 🌿 different background (light green)
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#22c55e",
    marginBottom: 14,
   
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  card: {
    width: "32%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",

    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#eee",
  },

  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 4,
    elevation: 3,
  },

  addBtn: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "#22c55e",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 3,
  },

  addText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 8,
  },

  restaurantName: {
    marginLeft: 4,
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },

  title: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
    paddingHorizontal: 8,
    color: "#111",
  },

  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16a34a",
    paddingHorizontal: 8,
    paddingBottom: 10,
    marginTop: 2,
  },
});
