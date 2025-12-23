import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";

export default function TestLocation() {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState(null);

  const getLiveLocation = async () => {
    try {
      setLoading(true);

      // 1️⃣ Ask permission
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow location permission"
        );
        return;
      }

      // 2️⃣ Get GPS location
      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const { latitude, longitude } = location.coords;

      setCoords({ latitude, longitude });

      // 3️⃣ Reverse Geocode
      const geo = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geo.length > 0) {
        console.log("RAW ADDRESS 👉", geo[0]);
        setAddress(geo[0]);
      }
    } catch (error) {
      console.log("LOCATION ERROR ❌", error);
      Alert.alert("Error", "Unable to fetch location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📍 Live Location Test</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={getLiveLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Get My Location</Text>
        )}
      </TouchableOpacity>

      {/* COORDINATES */}
      {coords && (
        <View style={styles.card}>
          <Text style={styles.heading}>Coordinates</Text>
          <Text>Latitude: {coords.latitude}</Text>
          <Text>Longitude: {coords.longitude}</Text>
        </View>
      )}

      {/* ADDRESS DETAILS */}
      {address && (
        <View style={styles.card}>
          <Text style={styles.heading}>Address Details</Text>

          <Text>
            Place: {address.name || "N/A"}
          </Text>

          <Text>
            Street: {address.street || "N/A"}
          </Text>

          <Text>
            City / Town: {address.city || address.subregion || "N/A"}
          </Text>

          <Text>
            Village / Area: {address.district || address.subregion || "N/A"}
          </Text>

          <Text>
            State: {address.region || "N/A"}
          </Text>

          <Text>
            Pincode: {address.postalCode || "N/A"}
          </Text>

          <Text>
            Country: {address.country || "N/A"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  btn: {
    backgroundColor: "#D81B60",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#f7f7f7",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
