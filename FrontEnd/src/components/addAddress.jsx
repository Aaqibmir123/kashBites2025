import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { addAddressApi } from "../../../../src/api/addressApi.js";

export default function AddAddress() {
  const router = useRouter();
  const product = useLocalSearchParams();


  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    village: "",
    city: "",
    pincode: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleContinue = async () => {
    // 🛑 Prevent multiple API calls
    if (loading) return;

    // 🔴 Basic validation
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // ✅ SAVE ADDRESS (ONLY ONCE)
      await addAddressApi(form);

      // ✅ NAVIGATE TO CHECKOUT
      router.push({
        pathname: "/(tabs)/cart/checkouts", // ❗ FIXED (no checkouts)
        params: {
          // ADDRESS
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          village: form.village,
          city: form.city,
          pincode: form.pincode,

          // PRODUCT
          productId: product.productId,
          productName: product.productName,
          productPrice: product.productPrice,
          productQty: product.productQty,
          productDescription: product.productDescription,
          productImage: product.productImage,
          restaurantId: product.restaurantId,
        },
      });
    } catch (error) {
      console.log("❌ Address save error:", error);
      Alert.alert("Error", "Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Delivery Address</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={form.name}
        onChangeText={(v) => handleChange("name", v)}
      />

      <TextInput
        placeholder="Phone"
        keyboardType="numeric"
        maxLength={10}
        style={styles.input}
        value={form.phone}
        onChangeText={(v) =>
          handleChange("phone", v.replace(/[^0-9]/g, ""))
        }
      />

      <TextInput
        placeholder="Email (optional)"
        style={styles.input}
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
      />

      <TextInput
        placeholder="Full Address"
        style={[styles.input, styles.textArea]}
        multiline
        value={form.address}
        onChangeText={(v) => handleChange("address", v)}
      />

      <TextInput
        placeholder="Village (optional)"
        style={styles.input}
        value={form.village}
        onChangeText={(v) => handleChange("village", v)}
      />

      <TextInput
        placeholder="City"
        style={styles.input}
        value={form.city}
        onChangeText={(v) => handleChange("city", v)}
      />

      <TextInput
        placeholder="Pincode"
        keyboardType="numeric"
        maxLength={6}
        style={styles.input}
        value={form.pincode}
        onChangeText={(v) =>
          handleChange("pincode", v.replace(/[^0-9]/g, ""))
        }
      />

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleContinue}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Continue to Checkout</Text>
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

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  btn: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  btnDisabled: {
    backgroundColor: "#FF634799",
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
