import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OrderStatusSummary({ counts }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Orders Overview</Text>

      <View style={styles.row}>
        <StatusBox label="Pending" value={counts.pending} color="#f1c40f" />
        <StatusBox label="Accepted" value={counts.accepted} color="#3498db" />
      </View>

      <View style={styles.row}>
        <StatusBox label="Rejected" value={counts.rejected} color="#e74c3c" />
        <StatusBox label="Delivered" value={counts.delivered} color="#2ecc71" />
      </View>
    </View>
  );
}

function StatusBox({ label, value, color }) {
  return (
    <View style={styles.box}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  box: {
    width: "48%",
    backgroundColor: "#f8f8f8",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },

  value: {
    fontSize: 20,
    fontWeight: "700",
  },

  label: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
});
