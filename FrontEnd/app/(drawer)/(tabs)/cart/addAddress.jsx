import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../../../../src/api/context/authContext";
import { PlaceOrder } from "../../../../src/api/orders";
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints";

export default function AddAddress() {
  const router = useRouter();
  const params = useLocalSearchParams(); // 👈 all params here
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  /* ---------------- PRODUCT DATA ---------------- */
  const price = Number(params.productPrice || 0);
  const qty = Number(params.productQty || 1);
  const total = price * qty;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- 🔙 BACK HANDLER (IMPORTANT) ---------------- */
  const handleBack = () => {
    // if (params.from === "order") {
    //   // 🔥 ALWAYS go to Orders page
    //   router.replace("/(tabs)/order");
    // } else {
    //   // 🔥 Normal cart flow
    //   router.back("/(tabs)/cart");
    // }
  };

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      Alert.alert("Error", "Please fill address details");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId: user._id,

        address: {
          name: form.name,
          phone: form.phone,
          address: form.address,
        },

        product: {
          productId: params.productId,
          name: params.productName,
          price,
          qty,
          image: params.productImage,
        },

        restaurantId: params.restaurantId,
      };

      const res = await PlaceOrder(payload);

      if (res.success) {
        Alert.alert("Success", "Order placed successfully");
        router.replace("/orderSuccess"); // ✔️ correct
      } else {
        Alert.alert("Error", res.message || "Order failed");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Checkout</Text>

        <View style={{ width: 32 }} />
      </View>

      {/* ---------- CONTENT ---------- */}
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.section}>Delivery Address</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={form.name}
          onChangeText={(v) => handleChange("name", v)}
        />

        <TextInput
          placeholder="Phone Number"
          keyboardType="numeric"
          maxLength={10}
          style={styles.input}
          value={form.phone}
          onChangeText={(v) => handleChange("phone", v)}
        />

        <TextInput
          placeholder="Full Address"
          style={[styles.input, styles.textArea]}
          multiline
          value={form.address}
          onChangeText={(v) => handleChange("address", v)}
        />

        <Text style={styles.section}>Order Summary</Text>

        <View style={styles.productCard}>
          <Image
            source={{
              uri: params.productImage
                ? `${BASE_IMAGE_URL}${params.productImage}`
                : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
            }}
            style={styles.image}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{params.productName}</Text>
            <Text>Qty: {qty}</Text>
            <Text style={styles.total}>₹ {total}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={placeOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 56,
    backgroundColor: "#D81B60",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  container: {
    padding: 16,
  },

  section: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  productCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: "bold",
  },

  total: {
    fontWeight: "bold",
    marginTop: 4,
    color: "green",
  },

  btn: {
    backgroundColor: "#D81B60",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
  },

  btnDisabled: {
    backgroundColor: "#D81B6099",
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
