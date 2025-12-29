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
import Toast from "react-native-toast-message";

import { getProductsByRestaurantApi } from "../../src/api/user/productsApi.js";
import {
  toggleFavoriteApi,
  getFavoritesApi,
} from "../../src/api/user/favorite.js";
import { BASE_IMAGE_URL } from "../../src/api/apiConfig.js";
import ProductBottomModal from "../../src/components/Resturant/ProductBottomModal";

export default function Products() {
  const router = useRouter();
  const { restaurantId, name } = useLocalSearchParams();

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({}); // ❤️ DB based
  const [loading, setLoading] = useState(true);

  // modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH PRODUCTS + FAVORITES ================= */
  useEffect(() => {
    if (!restaurantId) return;

    (async () => {
      try {
        const [prodRes, favRes] = await Promise.all([
          getProductsByRestaurantApi(restaurantId),
          getFavoritesApi(),
        ]);

        if (prodRes?.success) {
          setProducts(prodRes.data || []);
        }

        if (favRes?.success && Array.isArray(favRes.favorites)) {
          const favMap = {};
          favRes.favorites.forEach((id) => {
            favMap[id] = true;
          });
          setFavorites(favMap);
        }
      } catch (err) {
        console.log("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId]);

  /* ================= PRICE LOGIC ================= */
  const getDisplayPrice = (item) => {
    if (item.pricingType === "single") return `₹${item.price}`;

    if (item.variants?.length) {
      const prices = item.variants.map((v) => Number(v.price));
      return `From ₹${Math.min(...prices)}`;
    }
    return "₹0";
  };

  /* ================= ❤️ TOGGLE FAVORITE (DB) ================= */
  const handleToggleFavorite = async (productId) => {
    const wasFavorite = !!favorites[productId];

    try {
      // optimistic UI
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
      // rollback
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
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => {
        setSelectedProduct(item);
        setShowModal(true);
      }}
    >
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
          onPress={() => handleToggleFavorite(item._id)}
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
        <Text style={styles.price}>{getDisplayPrice(item)}</Text>

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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace("/");
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
            <Ionicons name="heart" size={16} color="#DC2626" />
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
