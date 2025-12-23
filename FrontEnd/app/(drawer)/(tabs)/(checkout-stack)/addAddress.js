import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { addAddressApi } from "../../../../src/api/addressApi.js";

export default function Address() {
  const router = useRouter();

  // ✅ Receive product details from ProductDetails → Buy Now
  const product = useLocalSearchParams();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    village: "",
    city: "",
    pincode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  console.log("Sending to Checkout:", { ...form, ...product });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      // Save Address API
      const response = await addAddressApi(form);
      console.log("Address saved successfully:", response);

      // ✅ Send BOTH: Address + Product to Checkout
      router.push({
        pathname: "/checkout",
        params: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          village: form.village,
          city: form.city,
          pincode: form.pincode,

          // Product
          productName: product.name,
          productPrice: product.price,
          productQty: product.qty,
          productDescription: product.description,
          productId: product.id,
          productImage: product.image || null,
          restaurantId: product.restaurantId,
        },
      });
    } catch (error) {
      console.error("Failed to save address or navigate:", error);
      Alert.alert(
        "Error",
        "Failed to save address or continue. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Delivery Address</Text>

      {/* NAME */}
      <TextInput
        placeholder="Full Name"
        value={form.name}
        onChangeText={(v) => handleChange("name", v)}
        style={styles.fullInput}
      />

      {/* PHONE + EMAIL */}
      <View style={styles.row}>
        <TextInput
          placeholder="Phone"
          keyboardType="numeric"
          maxLength={10}
          value={form.phone}
          onChangeText={(v) => handleChange("phone", v.replace(/[^0-9]/g, ""))}
          style={styles.halfInput}
        />

        <TextInput
          placeholder="Email (optional)"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          style={styles.halfInput}
        />
      </View>

      {/* ADDRESS */}
      <TextInput
        placeholder="Full Address"
        value={form.address}
        onChangeText={(v) => handleChange("address", v)}
        style={[styles.fullInput, styles.textArea]}
        multiline
      />

      {/* VILLAGE + CITY + PINCODE */}
      <View style={styles.row}>
        <TextInput
          placeholder="Village"
          value={form.village}
          onChangeText={(v) => handleChange("village", v)}
          style={styles.thirdInput}
        />

        <TextInput
          placeholder="City"
          value={form.city}
          onChangeText={(v) => handleChange("city", v)}
          style={styles.thirdInput}
        />

        <TextInput
          placeholder="Pincode"
          keyboardType="numeric"
          maxLength={6}
          value={form.pincode}
          onChangeText={(v) =>
            handleChange("pincode", v.replace(/[^0-9]/g, ""))
          }
          style={styles.thirdInput}
        />
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.btn, isLoading && styles.btnDisabled]}
        onPress={handleContinue}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Continue to Checkout</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  fullInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },

  halfInput: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },

  thirdInput: {
    width: "31%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
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
    marginTop: 20,
  },

  btnDisabled: {
    backgroundColor: "#FF634799",
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
