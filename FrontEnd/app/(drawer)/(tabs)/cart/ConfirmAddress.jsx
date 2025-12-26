import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useCheckout } from "../../../../src/api/context/checkoutContext";

export default function ConfirmAddress({ onChange }) {
  const { address } = useCheckout();

  // 🔥 Agar address hi nahi hai → kuch mat dikhao
  if (!address?.name) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivering To</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{address.name}</Text>
        <Text>{address.phone}</Text>
        <Text>{address.line1}</Text>
        <Text>{address.area}</Text>
        {address.pincode ? <Text>{address.pincode}</Text> : null}

        <Text style={styles.confirmed}>✓ Address confirmed</Text>
      </View>

      <TouchableOpacity onPress={onChange}>
        <Text style={styles.change}>Change / Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  card: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#eee",
  },
  name: { fontWeight: "700" },
  confirmed: {
    color: "green",
    marginTop: 6,
    fontWeight: "600",
  },
  change: {
    marginTop: 10,
    color: "#D81B60",
    fontWeight: "700",
  },
});
