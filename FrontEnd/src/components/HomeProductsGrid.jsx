import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_WIDTH = (width - 16 * 2 - CARD_GAP * 2) / 3;

// 🔹 DUMMY PRODUCTS (DESIGN ONLY)
const PRODUCTS = [
  { id: "1", name: "Burger", price: "₹120", image: "https://via.placeholder.com/150" },
  { id: "2", name: "Pizza", price: "₹299", image: "https://via.placeholder.com/150" },
  { id: "3", name: "Sandwich", price: "₹90", image: "https://via.placeholder.com/150" },
  { id: "4", name: "Pasta", price: "₹180", image: "https://via.placeholder.com/150" },
  { id: "5", name: "Fries", price: "₹70", image: "https://via.placeholder.com/150" },
  { id: "6", name: "Noodles", price: "₹160", image: "https://via.placeholder.com/150" },
];

export default function HomeProductsGrid() {
  return (
    <View style={styles.wrapper}>
      <FlatList
        data={PRODUCTS}
        numColumns={3}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: CARD_WIDTH,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  name: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
    color: "#111",
  },

  price: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
    color: "#16a34a", // green price
  },
});
