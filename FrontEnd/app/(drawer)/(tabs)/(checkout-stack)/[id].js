import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CartContext } from "../../../../src/api/context/CartContext.js";
import { getSingleProductApi } from "../../../../src/api/addResturantProducts";
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints.js";
import Toast from "react-native-toast-message";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getSingleProductApi(id);
        setProduct(res.data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>No Product Found</Text>
      </View>
    );
  }

  // ✅ ADD TO CART
 const handleAddToCart = () => {
  const cleanProduct = {
    productId: product._id,
    name: product.name,
    description: product.description,
    unitPrice: product.price,
    qty: qty,
    image: product.image,
  };

  addToCart(cleanProduct);

  Toast.show({
    type: "success",
    text1: "Added to Cart 🛒",
    text2: `${product.name} added successfully`,
    position: "top",
  });
};

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: product.image
            ? `${BASE_IMAGE_URL}${product.image}`
            : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
        }}
        style={styles.image}
      />

      <Text style={styles.title}>{product.name}</Text>

      <Text style={styles.price}>
        ₹ {product.price} × {qty} = ₹ {product.price * qty}
      </Text>

      <Text style={styles.desc}>{product.description}</Text>

      {/* QTY */}
      <View style={styles.qtyRow}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQty(qty > 1 ? qty - 1 : 1)}
        >
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyValue}>{qty}</Text>

        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQty(qty + 1)}
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* ADD TO CART */}
      <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
        <Text style={styles.cartText}>Add to Cart</Text>
      </TouchableOpacity>

      {/* BUY NOW */}
      <TouchableOpacity
        style={styles.buyBtn}
        onPress={() =>
          router.push({
            pathname: "addAddress",
            params: {
              id: product._id,
              name: product.name,
              price: product.price * qty, // ✅ total price
              qty: qty,
              image: product.image,
              restaurantId: product.restaurantId,
            },
          })
        }
      >
        <Text style={styles.buyText}>BUY NOW</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: "100%", height: 250, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  price: { fontSize: 18, color: "green", marginBottom: 10 },
  desc: { fontSize: 16, color: "#444", marginBottom: 15 },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  qtyBtn: {
    width: 45,
    height: 45,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  qtyText: { fontSize: 22, fontWeight: "bold" },
  qtyValue: { marginHorizontal: 20, fontSize: 20 },

  cartBtn: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  cartText: { fontSize: 16, fontWeight: "bold" },

  buyBtn: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
