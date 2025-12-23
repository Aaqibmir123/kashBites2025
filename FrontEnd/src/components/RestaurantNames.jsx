import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { getAllRestaurantsApi } from "../api/addResturantApi";
import { BASE_IMAGE_URL } from "../api/constants/endpoints";

export default function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await getAllRestaurantsApi();
      if (response?.success) {
        setRestaurants(response.data);
      }
    } catch (err) {
      console.log("Restaurant fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (item) => {
    router.push({
      pathname: "/restaurant/products",
      params: {
        restaurantId: item._id,
        name: item.name,
      },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => handlePress(item)}
    >
      <Image
        source={{
          uri: item.image
            ? `${BASE_IMAGE_URL}${item.image}`
            : "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        }}
        style={styles.image}
      />
      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Popular Restaurants</Text>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    color: "#1F2937",
  },

  card: {
    width: "32%",
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 110,
    borderRadius: 16,
  },

  name: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
});
