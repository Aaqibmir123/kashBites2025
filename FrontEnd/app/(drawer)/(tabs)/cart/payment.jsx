import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useCheckout } from "../../../../src/api/context/checkoutContext";
import { PlaceOrder } from "../../../../src/api/orders";
import { AuthContext } from "../../../../src/api/context/authContext";
import { clearCartApi } from "../../../../src/api/addTocartApi";
import { CartContext } from "../../../../src/api/context/CartContext";
import { addAddressApi } from "../../../../src/api/addressApi";

export default function Payment() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { resetCheckout, billing, address } = useCheckout();
  const { clearCart } = useContext(CartContext); // 🔥 CART CLEAR
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // ❌ no default
  const userId = user?._id;
  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      Alert.alert("Select Payment Method", "Please select a payment method");
      return;
    }

    if (paymentMethod !== "COD") {
      Alert.alert("Coming Soon", "This payment method will be available soon");
      return;
    }

    setLoading(true);

    try {
      /* ================= SAVE ADDRESS ================= */
      const addressPayload = {
        userId: user._id,
        name: address.name,
        phone: address.phone,
        address: address.line1,
      };

      const addressRes = await addAddressApi(addressPayload);
      console.log(addressRes, "addAddressApi");

      /* ================= PLACE ORDER ================= */
      const payload = {
        userId: user._id,
        address,
        items: billing.cartItems, // 🔥 MUST
        itemTotal: billing.itemTotal,
        deliveryFee: billing.deliveryFee,
        platformFee: billing.platformFee,
        gst: billing.tax,
        totalAmount: billing.grandTotal,
        paymentMethod: "COD",
      };

      const res = await PlaceOrder(payload);

      if (res?.success) {
        // ✅ RESET CHECKOUT CONTEXT
        resetCheckout();

        // ✅ CLEAR CART (FRONTEND + BACKEND)
        clearCart();
        await clearCartApi(userId);

        // ✅ GO TO SUCCESS
        router.replace("../../../orderSuccess");
      } else {
        Alert.alert("Error", res?.message || "Order failed");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {/* ===== PAYMENT METHOD ===== */}
        <Text style={styles.section}>Payment Method</Text>

        {/* COD (Selectable) */}
        <TouchableOpacity
          style={[
            styles.methodBox,
            paymentMethod === "COD" && styles.activeMethod,
          ]}
          onPress={() => setPaymentMethod("COD")}
        >
          <Ionicons
            name="cash-outline"
            size={22}
            color={paymentMethod === "COD" ? "#16A34A" : "#444"}
          />
          <Text style={styles.methodText}>Cash on Delivery</Text>
          {paymentMethod === "COD" && (
            <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
          )}
        </TouchableOpacity>

        {/* PHONEPE */}
        <View style={[styles.methodBox, styles.disabledMethod]}>
          <Ionicons name="phone-portrait-outline" size={22} color="#999" />
          <Text style={styles.disabledText}>PhonePe</Text>
          <Text style={styles.comingSoon}>Coming Soon</Text>
        </View>

        {/* UPI */}
        <View style={[styles.methodBox, styles.disabledMethod]}>
          <Ionicons name="qr-code-outline" size={22} color="#999" />
          <Text style={styles.disabledText}>UPI</Text>
          <Text style={styles.comingSoon}>Coming Soon</Text>
        </View>

        {/* DEBIT CARD */}
        <View style={[styles.methodBox, styles.disabledMethod]}>
          <Ionicons name="card-outline" size={22} color="#999" />
          <Text style={styles.disabledText}>Debit Card</Text>
          <Text style={styles.comingSoon}>Coming Soon</Text>
        </View>

        {/* ===== BILL ===== */}
        <View style={styles.billBox}>
          <BillRow label="Item Total" value={`₹ ${billing.itemTotal}`} />
          <BillRow label="Delivery Fee" value={`₹ ${billing.deliveryFee}`} />
          <BillRow label="Platform Fee" value={`₹ ${billing.platformFee}`} />
          <BillRow label="GST" value={`₹ ${billing.tax}`} />

          <View style={styles.divider} />

          <BillRow
            label="Grand Total"
            value={`₹ ${billing.grandTotal}`}
            bold
            highlight
          />
        </View>

        {/* ===== PLACE ORDER ===== */}
        <TouchableOpacity
          style={styles.btn}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              Place Order ₹ {billing.grandTotal}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ================= SMALL BILL ROW ================= */
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

  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  container: { padding: 16 },

  section: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  methodBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },

  activeMethod: {
    borderColor: "#16A34A",
    backgroundColor: "#ECFDF5",
  },

  disabledMethod: {
    borderColor: "#ddd",
    backgroundColor: "#F9FAFB",
  },

  methodText: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "600",
  },

  disabledText: {
    flex: 1,
    marginLeft: 10,
    color: "#999",
    fontWeight: "600",
  },

  comingSoon: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },

  billBox: {
    padding: 14,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 20,
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
  },

  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
