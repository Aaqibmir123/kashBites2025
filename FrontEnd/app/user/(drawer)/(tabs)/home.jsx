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
import Toast from "react-native-toast-message";

import { getAllProductsApi } from "../../../../src/api/user/productsApi.js";
import {
  toggleFavoriteApi,
  getFavoritesApi,
} from "../../../../src/api/user/favorite.js";
import { BASE_IMAGE_URL } from "../../../../src/api/apiConfig.js";

import ProductBottomModal from "../../../../src/components/Resturant/ProductBottomModal.jsx";
import AppHeader from "../../../../src/components/AppHeaderIcon.jsx";
import Restaurant from "../../../../src/components/RestaurantNames.jsx";
import MostSellingItems from "../../../../src/components/MostSellingItems.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProductsApi();
        console.log("PRODUCTS FETCH RESPONSE:", res);
        if (res?.success) {
          setProducts(res.data || []);
        }
      } catch (err) {
        console.log("PRODUCT FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= FETCH FAVORITES ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await getFavoritesApi();
        if (res?.success && Array.isArray(res.favorites)) {
          const favMap = {};
          res.favorites.forEach((id) => {
            favMap[id] = true;
          });
          setFavorites(favMap);
        }
      } catch (err) {
        console.log("FAVORITES FETCH ERROR:", err);
      }
    })();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  /* ================= PRICE ================= */
  const getDisplayPrice = (item) => {
    if (item.pricingType === "single") return `₹${item.price}`;
    if (item.variants?.length) {
      const prices = item.variants.map((v) => Number(v.price));
      return `From ₹${Math.min(...prices)}`;
    }
    return "₹0";
  };

  /* ================= ❤️ TOGGLE FAVORITE ================= */
  const handleToggleFavorite = async (productId) => {
    const wasFavorite = !!favorites[productId];
    try {
      setFavorites((prev) => ({
        ...prev,
        [productId]: !wasFavorite,
      }));

      await toggleFavoriteApi(productId);

      Toast.show({
        type: "success",
        text1: wasFavorite
          ? "Removed from Favorites 💔"
          : "Added to Favorites ❤️",
      });
    } catch (err) {
      setFavorites((prev) => ({
        ...prev,
        [productId]: wasFavorite,
      }));

      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  };

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  /* ================= PRODUCT CARD ================= */
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => {
        setSelectedProduct(item);
        setShowModal(true);
      }}
    >
      {/* IMAGE */}
      <Image
        source={{
          uri: item.image
            ? `${BASE_IMAGE_URL}${item.image}`
            : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
        }}
        style={styles.image}
      />

      {/* ❤️ FAVORITE */}
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => handleToggleFavorite(item._id)}
      >
        <Ionicons
          name={favorites[item._id] ? "heart" : "heart-outline"}
          size={18}
          color={favorites[item._id] ? "#DC2626" : "#111"}
        />
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

      {/* 🍴 RESTAURANT NAME */}
      <View style={styles.restaurantRow}>
        <Ionicons name="restaurant-outline" size={14} color="#16a34a" />
        <Text style={styles.restaurantName} numberOfLines={1}>
          {item?.restaurantId?.name || "Restaurant"}
        </Text>
      </View>

      {/* PRODUCT NAME */}
      <Text style={styles.title} numberOfLines={1}>
        {item.name}
      </Text>

      {/* PRICE */}
      <Text style={styles.price}>{getDisplayPrice(item)}</Text>
    </TouchableOpacity>
  );

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <AppHeader onSearch={setSearchText} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Popular</Text>}
        ListFooterComponent={
          <>
            <Restaurant />
            <MostSellingItems />
          </>
        }
      />

      {/* 🔽 PRODUCT MODAL */}
      <ProductBottomModal
        visible={showModal}
        product={
          selectedProduct
            ? {
                ...selectedProduct,
                // ✅ force restaurantId to be ID only
                restaurantId:
                  selectedProduct.restaurantId?._id ||
                  selectedProduct.restaurantId,
              }
            : null
        }
        isFavorite={selectedProduct ? favorites[selectedProduct._id] : false}
        onToggleFavorite={handleToggleFavorite}
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
    backgroundColor: "#F6F6F6",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 12,
    marginLeft: 10,
    color: "#111",
  },

  card: {
    width: "32%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 6,
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
    zIndex: 10,
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
    gap: 4,
    paddingHorizontal: 8,
    marginTop: 6,
  },

  restaurantName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16a34a",
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
