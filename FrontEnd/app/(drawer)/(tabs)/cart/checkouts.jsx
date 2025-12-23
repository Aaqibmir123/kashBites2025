import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PlaceOrder } from "../../../../src/api/orders.js";
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints.js";

export default function Checkout() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const {
    name,
    phone,
    address,
    city,
    pincode,

    productId,
    productName,
    productPrice,
    productQty,
    productImage,
    restaurantId,
  } = params;

  console.log(productQty,'hello')

  const totalPrice =
    Number(productPrice || 0) * Number(productQty || 1);

  console.log("CHECKOUT PRODUCT 👉", {
    productName,
    productPrice,
    productQty,
    totalPrice,
  });

  const handlePlaceOrder = async () => {
    setLoading(true);

    const body = {
      restaurantId,
      product: {
        id: productId,
        name: productName,
        price: Number(productPrice),
        qty: Number(productQty),
      },
      address: {
        name,
        phone,
        address,
        city,
        pincode,
      },
    };

    try {
      await PlaceOrder(body);
      router.push("/orderSuccess");
    } catch (e) {
      console.log("❌ Order error:", e);
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      {/* 📍 ADDRESS */}
      <View style={styles.box}>
        <Text style={styles.label}>Delivery Address</Text>
        <Text>Name: {name}</Text>
        <Text>Phone: {phone}</Text>
        <Text>Address: {address}</Text>
        <Text>City: {city}</Text>
        <Text>Pincode: {pincode}</Text>
      </View>

      {/* 🛒 PRODUCT */}
      <View style={styles.card}>
        <Image
          source={{
            uri: productImage
              ? `${BASE_IMAGE_URL}${productImage}`
              : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
          }}
          style={styles.image}
        />

        <View style={styles.details}>
          <Text style={styles.productName}>{productName}</Text>

          <Text style={styles.priceQty}>
            ₹ {productPrice} × {productQty}
          </Text>

          <Text style={styles.total}>
            Total: ₹ {totalPrice}
          </Text>
        </View>
      </View>

      {/* ✅ PLACE ORDER */}
      <TouchableOpacity
        style={styles.btn}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  box: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  /* PRODUCT CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },

  image: {
    width: 120,
    height: 120,
  },

  details: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },

  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  priceQty: {
    fontSize: 16,
    color: "#333",
  },

  total: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 6,
    color: "#28a745",
  },

  btn: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
