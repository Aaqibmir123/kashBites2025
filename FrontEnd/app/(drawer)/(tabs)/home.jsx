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
import * as Location from "expo-location";

import { getAllProductsApi } from "../../../src/api/addResturantProducts.js";
import { BASE_IMAGE_URL } from "../../../src/api/constants/endpoints.js";

import HomeSlider from "../../../src/components/HomeSlider.jsx";
import Restaurant from "../../../src/components/RestaurantNames.jsx";
import ProductBottomModal from "../../../src/components/Resturant/ProductBottomModal.jsx";
import SearchBar from "../../../src/components/SearchBar.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProductsApi();
        if (res?.success) {
          setProducts(res.data || []);
          setFilteredProducts(res.data || []);
        }
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
        await Location.getCurrentPositionAsync({});
      } catch (err) {
        console.log("Location error:", err);
      }
    })();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  /* ================= PRICE LOGIC (IMPORTANT) ================= */
  const getDisplayPrice = (item) => {
    // Single price
    if (item.pricingType === "single") {
      return `₹${item.price}`;
    }

    // Size / Quantity
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  /* ================= PRODUCT CARD ================= */
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

      {/* ✅ CORRECT PRICE DISPLAY */}
      <Text style={styles.price}>{getDisplayPrice(item)}</Text>

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
      <SearchBar value={search} onChange={setSearch} />

      {/* PRODUCTS */}
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

      {/* PRODUCT MODAL */}
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
    fontWeight: "bold",
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
