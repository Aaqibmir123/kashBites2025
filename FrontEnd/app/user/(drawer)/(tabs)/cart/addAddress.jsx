import React, { useState, useEffect, useContext } from "react";
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

import { BASE_IMAGE_URL } from "../../../../../src/api/apiConfig";
import { useCheckout } from "../../../../../src/api/context/checkoutContext";
import { getUserLastAddressApi } from "../../../../../src/api/user/addTocartApi";
import ConfirmAddress from "./ConfirmAddress";
import { AuthContext } from "../../../../../src/api/context/authContext";

export default function AddAddress() {
  const router = useRouter();
  const { billing, address, setAddress, calculateBill } = useCheckout();
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  /* ================= UI STATE ================= */
  const [showForm, setShowForm] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(true);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    address: "",
    pincode: "",
  });

  /* ================= FETCH LAST ADDRESS ================= */
  useEffect(() => {
    fetchLastAddress();
  }, []);

  const fetchLastAddress = async () => {
    try {
      const res = await getUserLastAddressApi(userId);

      if (res?.success && res.address) {
        setAddress({
          name: res.address.name,
          phone: res.address.phone,
          area: res.address.village,
          line1: res.address.house,
          pincode: res.address.pincode || "",
        });

        setShowForm(false); // ✅ direct checkout
      } else {
        setShowForm(true); // ✅ new user
      }
    } catch (err) {
      setShowForm(true);
    } finally {
      setLoadingAddress(false);
    }
  };

  /* ================= BILLING ================= */
  const cartItems = billing.cartItems || [];
  const itemTotal = billing.itemTotal || 0;
  const deliveryFee = billing.deliveryFee || 0;
  const platformFee = billing.platformFee || 0;
  const tax = billing.tax || 0;
  const grandTotal =
    billing.grandTotal || itemTotal + deliveryFee + platformFee + tax;

  /* ================= HANDLERS ================= */
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveAddress = () => {
    if (!form.name || !form.phone || !form.area || !form.address) {
      Alert.alert("Incomplete Address", "Please fill all required fields");
      return;
    }

    setAddress({
      name: form.name,
      phone: form.phone,
      area: form.area,
      line1: form.address,
      pincode: form.pincode,
    });

    setShowForm(false); // ✅ show full checkout
  };

  const goToPayment = () => {
    calculateBill({ itemTotal });
    router.push("/user/(tabs)/cart/payment");
  };

  if (loadingAddress) {
    return (
      <View style={styles.center}>
        <Text>Loading address...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Address</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {/* ================= CASE 1: ADDRESS FORM ONLY ================= */}
        {showForm && (
          <>
            <Text style={styles.section}>Enter Delivery Details</Text>

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
              onChangeText={(v) => handleChange("phone", v)}
            />

            <TextInput
              placeholder="Area / Village"
              style={styles.input}
              value={form.area}
              onChangeText={(v) => handleChange("area", v)}
            />

            <TextInput
              placeholder="House / Landmark"
              multiline
              style={[styles.input, styles.textArea]}
              value={form.address}
              onChangeText={(v) => handleChange("address", v)}
            />

            <TextInput
              placeholder="Pincode (optional)"
              keyboardType="numeric"
              maxLength={6}
              style={styles.input}
              value={form.pincode}
              onChangeText={(v) => handleChange("pincode", v)}
            />

            <TouchableOpacity style={styles.btn} onPress={saveAddress}>
              <Text style={styles.btnText}>Save Address</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ================= CASE 2: FULL CHECKOUT ================= */}
        {!showForm && address?.name && (
          <>
            {/* CONFIRM ADDRESS */}
            <ConfirmAddress
              onChange={() => {
                setForm({
                  name: "",
                  phone: "",
                  area: "",
                  address: "",
                  pincode: "",
                });
                setShowForm(true);
              }}
            />

            {/* ORDER ITEMS */}
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

            {/* BILL */}
            <View style={styles.billBox}>
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

            {/* PAYMENT */}
            <TouchableOpacity style={styles.btn} onPress={goToPayment}>
              <Text style={styles.btnText}>
                Proceed to Payment ₹ {grandTotal}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= BILL ROW ================= */
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  section: { fontSize: 16, fontWeight: "700", marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
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
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  billLabel: { fontSize: 14 },
  billValue: { fontSize: 14 },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 8 },
  btn: {
    backgroundColor: "#D81B60",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
