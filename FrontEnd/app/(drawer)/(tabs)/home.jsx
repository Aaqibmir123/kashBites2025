import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import { getAllProductsApi } from "../../../src/api/addResturantProducts.js";
import { BASE_IMAGE_URL } from "../../../src/api/constants/endpoints.js";

import HomeSlider from "../../../src/components/HomeSlider.jsx";
import Restaurant from "../../../src/components/RestaurantNames.jsx";
import ProductBottomModal from "../../../src/components/Resturant/ProductBottomModal.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔹 modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  console.log(selectedProduct,'selectedProduct')

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProductsApi();
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.log("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= USER LOCATION ================= */
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({});
        console.log("📍 LOCATION:", loc.coords);

      } catch (err) {
        console.log("Location error:", err);
      }
    })();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  /* ================= CARD ================= */
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

      <Text style={styles.title} numberOfLines={1}>
        {item.name}
      </Text>

      <Text style={styles.price}>₹{item.price}</Text>

      {/* 🔥 OPEN MODAL INSTEAD OF NAVIGATION */}
      <TouchableOpacity
        style={styles.orderBtn}
        onPress={() => {
          setSelectedProduct(item);
          setShowModal(true);
        }}
      >
        <Text style={styles.orderText}>Order Now</Text>
      </TouchableOpacity>
    </View>
  );

  /* ================= UI ================= */
  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* SEARCH */}
      <TextInput
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* PRODUCTS LIST */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<HomeSlider />}
        ListFooterComponent={
          <View style={{ marginTop: 20 }}>
            <Restaurant />
          </View>
        }
      />

      {/* 🔥 PRODUCT MODAL */}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },

  card: {
    width: "32%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginBottom: 12,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 90,
    borderRadius: 8,
  },

  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },

  price: {
    fontSize: 12,
    color: "green",
    marginTop: 3,
  },

  orderBtn: {
    backgroundColor: "#FF6347",
    marginTop: 6,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
  },

  orderText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
