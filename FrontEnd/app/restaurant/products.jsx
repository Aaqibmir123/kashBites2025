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
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getProductsByRestaurantApi } from "../../src/api/addResturantProducts";
import { BASE_IMAGE_URL } from "../../src/api/constants/endpoints";
import ProductBottomModal from "../../src/components/Resturant/ProductBottomModal";

export default function Products() {
  const { restaurantId, name } = useLocalSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // favorite state (local)
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    if (restaurantId) fetchProducts();
  }, [restaurantId]);

  const fetchProducts = async () => {
    try {
      const res = await getProductsByRestaurantApi(restaurantId);
      if (res?.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.log("PRODUCT FETCH ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  // ADD button click
  const handleAddPress = (product) => {
    console.log('hello', product)
    setSelectedProduct(product);
    setShowModal(true);
  };

  // favorite toggle
  const toggleFavorite = (productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

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

        {/* ❤️ Favorite */}
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

      {/* NAME */}
      <Text numberOfLines={1} style={styles.productName}>
        {item.name}
      </Text>

      {/* PRICE + ADD */}
      <View style={styles.bottomRow}>
        <Text style={styles.price}>₹{item.price}</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleAddPress(item)}
        >
          <Text style={styles.addText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>

        <View style={styles.restaurantBox}>
          <Text numberOfLines={1} style={styles.restaurantName}>
            {name}
          </Text>
          <Ionicons name="heart-outline" size={18} color="#16A34A" />
        </View>
      </View>

      {/* ===== PRODUCTS GRID ===== */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* ===== BOTTOM MODAL ===== */}
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
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  restaurantBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    maxWidth: "60%",
  },

  restaurantName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#166534",
    maxWidth: 100,
  },

  /* PRODUCT CARD */
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
