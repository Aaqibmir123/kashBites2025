import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SmartSearchBar({
  value,
  onChange,
  suggestions = [],
  onSelect,
}) {
  return (
    <View style={styles.wrapper}>
      {/* 🔍 SEARCH BAR */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#6B7280" />

        <TextInput
          placeholder="Search products..."
          value={value}
          onChangeText={onChange}
          placeholderTextColor="#9CA3AF"
          selectionColor="#16A34A"
          style={styles.input}
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* 🔽 LIVE SUGGESTIONS */}
      {value.length > 0 && suggestions.length > 0 && (
        <View style={styles.suggestionBox}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item._id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => onSelect(item)}
              >
                <Ionicons
                  name="fast-food-outline"
                  size={16}
                  color="#16A34A"
                />
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    zIndex: 100,
  },

  /* 🔥 MAIN SEARCH BAR */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9", // soft bg
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 26, // pill shape
    gap: 10,
  },

  /* ❌ NO BORDER / NO FOCUS OUTLINE */
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    borderWidth: 0,
    outlineStyle: "none", // web focus outline remove
    outlineWidth: 0,
    backgroundColor: "transparent",
  },

  /* 🔽 SUGGESTIONS DROPDOWN */
  suggestionBox: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    borderRadius: 18,
    maxHeight: 220,
    elevation: 5,
    overflow: "hidden",
  },

  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  suggestionText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
});
