import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeTopBar() {
  return (
    <View style={styles.container}>
      {/* LEFT: TITLE */}
      <Text style={styles.title}>Home</Text>

      {/* RIGHT: CART ICON */}
      <TouchableOpacity style={styles.iconBtn}>
        <Ionicons name="cart-outline" size={24} color="#111" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56, // ⬅️ reduced height (no second line)
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 18,
    fontWeight: "600", // ⬅️ semibold (figma-like)
    color: "#111",
  },

  iconBtn: {
    padding: 4,
  },
});
