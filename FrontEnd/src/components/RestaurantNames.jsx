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
import { BASE_IMAGE_URL } from "../api/apiConfig.js";
import { getResturantList } from "../api/user/getResturantList.js";
export default function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await getResturantList();
      console.log("Fetched restaurants:", response);
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
      pathname: "/user/products",
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
      <Text style={styles.heading}>
        <Text style={styles.headerTitle}>Popular Restaurants</Text>
      </Text>

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
  heading: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#22c55e",
    marginBottom: 14,
   
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
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
