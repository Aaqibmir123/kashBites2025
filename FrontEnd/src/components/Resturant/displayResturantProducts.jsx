import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../../api/context/authContext.js";
import {
  getProductsByRestaurantApi,
  deleteProduct,
} from "../../api/resturants/addResturantProducts.js";
import EditProduct from "./editProduct.js";
import { BASE_IMAGE_URL } from "../../../src/api/apiConfig.js"

export default function ProductsList({ refreshKey }) {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    if (!user?.restaurantId) return;
    setLoading(true);

    try {
      const res = await getProductsByRestaurantApi(user.restaurantId);
      if (res.success) {
        setProducts(res.data);
      } else {
        Toast.show({
          type: "error",
          text1: "Fetch Failed",
          text2: res.message || "Something went wrong",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to fetch products",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= PRICE DISPLAY LOGIC ================= */
  const getDisplayPrice = (item) => {
    // Single price product
    if (item.pricingType === "single") {
      return `₹${item.price}`;
    }

    // Size / Quantity based
    if (
      item.pricingType !== "single" &&
      Array.isArray(item.variants) &&
      item.variants.length > 0
    ) {
      const prices = item.variants.map((v) => Number(v.price));
      const minPrice = Math.min(...prices);
      return `From ₹${minPrice}`;
    }

    return "₹0";
  };

  /* ================= ACTIONS ================= */
  const handleEdit = (item) => setSelectedProduct(item);

  const handleDelete = async (item) => {
    try {
      const res = await deleteProduct(item._id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== item._id));
        Toast.show({
          type: "success",
          text1: "Deleted",
          text2: `${item.name} deleted`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Delete Failed",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
      });
    }
  };

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.image
            ? `${BASE_IMAGE_URL}${item.image}`
            : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
        }}
        style={styles.image}
      />

      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>

      <Text numberOfLines={1} style={styles.description}>
        {item.description || "No description"}
      </Text>

      {/* ✅ CORRECT PRICE */}
      <Text style={styles.price}>{getDisplayPrice(item)}</Text>

      {/* OPTIONAL INFO */}
      <Text style={styles.meta}>
        {item.pricingType === "single"
          ? "Single Price"
          : item.pricingType === "size"
          ? "Multiple Sizes"
          : "Quantity Options"}
      </Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={3}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ color: "#666" }}>No products available</Text>
          </View>
        }
      />

      {/* EDIT MODAL */}
      {selectedProduct && (
        <EditProduct
          product={selectedProduct}
          close={() => setSelectedProduct(null)}
          refreshList={fetchProducts}
        />
      )}

      <Toast />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },

  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    width: "31%",
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#ececec",
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 2,
  },

  description: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "tomato",
    marginBottom: 2,
  },

  meta: {
    fontSize: 10,
    color: "#888",
    marginBottom: 8,
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  editBtn: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },

  deleteBtn: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
});
