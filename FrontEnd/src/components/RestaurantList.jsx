import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import { getResturantList } from "../api/user/getResturantList";
import { BASE_IMAGE_URL } from "../api/apiConfig";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter(); // 👈 ROUTER

  useEffect(() => {
    (async () => {
      try {
        const res = await getResturantList();
        if (res?.success) {
          setRestaurants(res.data || []);
        }
      } catch (e) {
        console.log("Restaurant API error", e);
      }
    })();
  }, []);

  /* ================= CLICK HANDLER ================= */
  const openRestaurantProducts = (restaurant) => {
    router.push({
      pathname: ".",
      params: {
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
      },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openRestaurantProducts(item)} // 👈 FUNCTION CALL
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: `${BASE_IMAGE_URL}${item.image}` }}
        style={styles.image}
      />
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.title}>Popular Restaurants</Text>

      <FlatList
        data={restaurants}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 12,
    marginLeft: 10,
  },

  card: {
    width: 100,
    marginRight: 12,
    alignItems: "center",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
  },

  name: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
