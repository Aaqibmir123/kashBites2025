import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PlaceOrder } from "../../../../src/api/orders.js";

export default function Checkout() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  // 🧾 Extract all data
  const {
    name,
    phone,
    email,
    address,
    village,
    city,
    pincode,

    productId,
    productName,
    productPrice,
    productQty,
    productDescription,
    productImage,

    userId,
    restaurantId,
  } = params;

  // 📦 Place Order Function
  const handlePlaceOrder = async () => {
    setLoading(true);

    const body = {
      userId,
      restaurantId,

      product: {
        id: productId,
        name: productName,
        description: productDescription,
        price: Number(productPrice),
        qty: Number(productQty),
      },

      address: {
        name,
        phone,
        email,
        address,
        village,
        city,
        pincode,
      },
    };

    console.log("📤 Sending Order:", body);

    try {
      const res = await PlaceOrder(body);
      console.log("✅ ORDER SUCCESS:", res);

      // Redirect to Success Page
      router.push("/orderSuccess");
    } catch (err) {
      console.log("❌ ORDER ERROR:", err);
      Alert.alert("Error", "Something went wrong while placing order!");
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🏠 DELIVERY ADDRESS */}
      <Text style={styles.sectionTitle}>Delivery Address</Text>

      <View style={styles.addressBox}>
        <Text style={styles.text}>Name: {name}</Text>
        <Text style={styles.text}>Phone: {phone}</Text>
        <Text style={styles.text}>Address: {address}</Text>
        {village ? <Text style={styles.text}>Village: {village}</Text> : null}
        <Text style={styles.text}>City: {city}</Text>
        <Text style={styles.text}>Pincode: {pincode}</Text>
      </View>

      {/* 🛒 ORDER SUMMARY */}
      <Text style={styles.sectionTitle}>Order Summary</Text>

      <View style={styles.orderBox}>
        <Image
          source={{
            uri:
              productImage ||
              "https://cdn-icons-png.flaticon.com/512/837/837760.png",
          }}
          style={styles.productImage}
        />

        <Text style={styles.text}>Product: {productName}</Text>
        <Text style={styles.text}>Description: {productDescription}</Text>
        <Text style={styles.text}>
          Price: ₹ {productPrice} x {productQty}
        </Text>

        <Text style={styles.totalText}>
          Total: ₹ {Number(productPrice) * Number(productQty)}
        </Text>
      </View>

      {/* 🟢 PLACE ORDER BUTTON */}
      <TouchableOpacity
        style={styles.placeOrderBtn}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text style={styles.placeOrderText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 15,
  },

  addressBox: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },

  orderBox: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },

  productImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    marginBottom: 5,
  },

  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  placeOrderBtn: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },

  placeOrderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
