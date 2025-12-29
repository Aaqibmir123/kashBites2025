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
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import AppHeader from "@/src/components/AppHeaderIcon";
import { BASE_IMAGE_URL } from "@/src/api/apiConfig";

import { getFavoritesApi, toggleFavoriteApi } from "@/src/api/user/favorite";
import { getAllProductsApi } from "@/src/api/user/productsApi";

import ProductBottomModal from "@/src/components/Resturant/ProductBottomModal";

export default function Favourites() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  // modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH FAVORITES + PRODUCTS ================= */
  useEffect(() => {
    (async () => {
      try {
        const favRes = await getFavoritesApi();
        const prodRes = await getAllProductsApi();

        if (favRes?.success && prodRes?.success) {
          const favIds = favRes.favorites || [];

          const favMap = {};
          favIds.forEach((id) => (favMap[id] = true));
          setFavorites(favMap);

          const favProducts = prodRes.data.filter((p) =>
            favIds.includes(p._id)
          );

          setProducts(favProducts);
        }
      } catch (err) {
        console.log("FAVOURITES ERROR:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= REMOVE FROM FAVORITES ================= */
  const handleRemoveFavorite = async (productId) => {
    try {
      await toggleFavoriteApi(productId);

      setProducts((prev) => prev.filter((item) => item._id !== productId));

      Toast.show({
        type: "success",
        text1: "Removed from Favorites 💔",
      });
    } catch (err) {
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

  /* ================= EMPTY STATE ================= */
  if (!products.length) {
    return (
      <View style={styles.container}>
        <AppHeader title="Favourites" />

        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyText}>No favourite items yet ❤️</Text>
        </View>
      </View>
    );
  }

  /* ================= PRODUCT CARD ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          setSelectedProduct(item);
          setShowModal(true);
        }}
      >
        <Image
          source={{
            uri: item.image
              ? `${BASE_IMAGE_URL}${item.image}`
              : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
          }}
          style={styles.image}
        />
      </TouchableOpacity>

      {/* ❤️ REMOVE FAVORITE */}
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => handleRemoveFavorite(item._id)}
      >
        <Ionicons name="heart" size={18} color="#DC2626" />
      </TouchableOpacity>

      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>
          ₹{item.price || item?.variants?.[0]?.price}
        </Text>

        {/* ➕ ADD BUTTON */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setSelectedProduct(item);
            setShowModal(true);
          }}
        >
          <Text style={styles.addText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <AppHeader title="Favourites" />

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      {/* 🔽 PRODUCT MODAL */}
      <ProductBottomModal
        visible={showModal}
        product={
          selectedProduct
            ? {
                ...selectedProduct,
                // ✅ yahin restaurantId clean kar diya
                restaurantId:
                  selectedProduct.restaurantId?._id ||
                  selectedProduct.restaurantId,
              }
            : null
        }
        isFavorite={selectedProduct ? favorites[selectedProduct._id] : false}
        onToggleFavorite={handleRemoveFavorite}
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

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#E5E7EB",
  },

  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    elevation: 3,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    paddingHorizontal: 8,
    color: "#111",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 10,
    marginTop: 6,
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16A34A",
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
