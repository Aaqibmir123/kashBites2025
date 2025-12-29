import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getProductsByRestaurantApi } from "../../src/api/resturants/addResturantProducts";
import { BASE_IMAGE_URL } from "../../src/api/apiConfig.js"
import ProductBottomModal from "../../src/components/Resturant/ProductBottomModal";

export default function Products() {
  const router = useRouter();
  const { restaurantId, name } = useLocalSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // favorites (local only)
  const [favorites, setFavorites] = useState({});

  /* ================= FETCH ================= */
  useEffect(() => {
    if (restaurantId) fetchProducts();
  }, [restaurantId]);

  const fetchProducts = async () => {
    try {
      const res = await getProductsByRestaurantApi(restaurantId);
      if (res?.success) {
        setProducts(res.data || []);
      }
    } catch (err) {
      console.log("PRODUCT FETCH ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PRICE LOGIC ================= */
  const getDisplayPrice = (item) => {
    // single price
    if (item.pricingType === "single") {
      return `₹${item.price}`;
    }

    // size / quantity
    if (
      item.pricingType !== "single" &&
      Array.isArray(item.variants) &&
      item.variants.length > 0
    ) {
      const prices = item.variants.map((v) => Number(v.price));
      return `From ₹${Math.min(...prices)}`;
    }

    return "₹0";
  };

  /* ================= ACTIONS ================= */
  const handleAddPress = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* IMAGE + FAVORITE */}
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: item.image
              ? `${BASE_IMAGE_URL}${item.image}`
              : "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
          }}
          style={styles.productImg}
        />

        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(item._id)}
        >
          <Ionicons
            name={favorites[item._id] ? "heart" : "heart-outline"}
            size={20}
            color={favorites[item._id] ? "#DC2626" : "#111"}
          />
        </TouchableOpacity>
      </View>

      <Text numberOfLines={1} style={styles.productName}>
        {item.name}
      </Text>

      <View style={styles.bottomRow}>
        {/* ✅ FIXED PRICE */}
        <Text style={styles.price}>{getDisplayPrice(item)}</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleAddPress(item)}
        >
          <Text style={styles.addText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ================= LOADER ================= */
  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            // 🔥 SAFE BACK (NO WARNING)
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/"); // fallback (home / tabs root)
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Menu</Text>

          <View style={styles.restaurantBox}>
            <Text numberOfLines={1} style={styles.restaurantName}>
              {name}
            </Text>
            <Ionicons name="heart-outline" size={16} color="#16A34A" />
          </View>
        </View>

        <View style={{ width: 32 }} />
      </View>

      {/* ================= PRODUCTS ================= */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* ================= MODAL ================= */}
      <ProductBottomModal
        visible={showModal}
        product={selectedProduct}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 3,
  },

  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    alignItems: "center",
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  restaurantBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 4,
    gap: 6,
    maxWidth: 180,
  },

  restaurantName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
    maxWidth: 140,
  },

  card: {
    width: "48%",
    marginBottom: 18,
  },

  imageWrapper: {
    position: "relative",
  },

  productImg: {
    width: "100%",
    height: 150,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },

  favBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 4,
  },

  productName: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },

  bottomRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#15803D",
  },

  addBtn: {
    borderWidth: 1,
    borderColor: "#16A34A",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },

  addText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16A34A",
  },
});
