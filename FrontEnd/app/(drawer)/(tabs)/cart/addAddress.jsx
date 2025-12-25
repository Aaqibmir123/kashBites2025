import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../../../../src/api/context/authContext";
import { BASE_IMAGE_URL } from "../../../../src/api/constants/endpoints";
import { useCheckout } from "../../../../src/api/context/checkoutContext";

export default function AddAddress() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  /* ===== CHECKOUT CONTEXT ===== */
  const { billing, address, setAddress, calculateBill } = useCheckout();

  const cartItems = billing.cartItems || [];
  const itemTotal = billing.itemTotal || 0;
  const deliveryFee = billing.deliveryFee || 0;
  const platformFee = billing.platformFee || 0;
  const tax = billing.tax || 0;
  const grandTotal =
    billing.grandTotal ||
    itemTotal + deliveryFee + platformFee + tax;

  /* ===== ADDRESS FORM ===== */
  const [form, setForm] = useState({
    name: address?.name || "",
    phone: address?.phone || "",
    address: address?.line1 || "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ===== CONTINUE TO PAYMENT ===== */
  const goToPayment = () => {
    if (!form.name || !form.phone || !form.address) {
      Alert.alert("Error", "Please fill address details");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Error", "Cart is empty");
      return;
    }

    // ✅ SAVE ADDRESS
    setAddress({
      name: form.name,
      phone: form.phone,
      line1: form.address,
    });

    // ✅ BILL (safe re-calc)
    calculateBill({ itemTotal });

    router.push("/(tabs)/cart/payment");
  };

  return (
    <View style={styles.root}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {/* ===== ADDRESS ===== */}
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
          multiline
          style={[styles.input, styles.textArea]}
          value={form.address}
          onChangeText={(v) => handleChange("address", v)}
        />

        {/* ===== ORDER ITEMS ===== */}
        <Text style={styles.section}>Order Items</Text>

        {cartItems.map((item) => (
          <View key={item._id} style={styles.itemRow}>
            <Image
              source={{
                uri: item.image
                  ? `${BASE_IMAGE_URL}${item.image}`
                  : "https://cdn-icons-png.flaticon.com/512/837/837760.png",
              }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.qty}>Qty: {item.qty}</Text>
            </View>

            <Text style={styles.itemPrice}>₹ {item.price}</Text>
          </View>
        ))}

        {/* ===== BILLING ===== */}
        <View style={styles.billBox}>
          <Text style={styles.billTitle}>Bill Details</Text>

          <BillRow label="Item Total" value={`₹ ${itemTotal}`} />
          <BillRow label="Delivery Fee" value={`₹ ${deliveryFee}`} />
          <BillRow label="Platform Fee" value={`₹ ${platformFee}`} />
          <BillRow label="GST" value={`₹ ${tax}`} />

          <View style={styles.divider} />

          <BillRow
            label="Grand Total"
            value={`₹ ${grandTotal}`}
            bold
            highlight
          />
        </View>

        {/* ===== CONTINUE ===== */}
        <TouchableOpacity style={styles.btn} onPress={goToPayment}>
          <Text style={styles.btnText}>
            Continue to Payment ₹ {grandTotal}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ===== BILL ROW ===== */
const BillRow = ({ label, value, bold, highlight }) => (
  <View style={styles.billRow}>
    <Text style={[styles.billLabel, bold && { fontWeight: "700" }]}>
      {label}
    </Text>
    <Text
      style={[
        styles.billValue,
        highlight && { color: "#D81B60", fontWeight: "800" },
      ]}
    >
      {value}
    </Text>
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 56,
    backgroundColor: "#D81B60",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  container: { padding: 16 },

  section: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 10,
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

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },

  itemName: { fontWeight: "600" },
  qty: { fontSize: 12, color: "#555" },
  itemPrice: { fontWeight: "700", color: "#2E7D32" },

  billBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  billTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  billLabel: { fontSize: 14, color: "#444" },
  billValue: { fontSize: 14 },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },

  btn: {
    backgroundColor: "#D81B60",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
