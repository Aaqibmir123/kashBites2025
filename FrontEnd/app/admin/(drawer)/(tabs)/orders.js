// app/admin/(tabs)/orders.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function Orders() {
  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setLocation(loc.coords);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&format=json`
        );
        const data = await response.json();
        setAddress(data?.display_name || "Address not found");
      } catch (e) {
        setErrorMsg("Error fetching location");
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* 🔥 HEADER WITH DRAWER ICON */}
    

      <ScrollView contentContainerStyle={styles.container}>
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        {location ? (
          <View style={styles.locationBox}>
            <Text style={styles.locText}>📍 User Location</Text>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Text>Accuracy: {location.accuracy?.toFixed(2)} meters</Text>

            <Text style={{ marginTop: 10, fontWeight: "bold" }}>Address:</Text>
            <Text>{address}</Text>
          </View>
        ) : (
          !errorMsg && <Text>Fetching location...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: "#FF6347",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  locationBox: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  locText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
