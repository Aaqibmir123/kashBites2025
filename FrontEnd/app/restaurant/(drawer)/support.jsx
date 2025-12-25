import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Support() {
  const navigation = useNavigation();

  const phone = "+919596523404"; // dummy
  const email = "support@kashbites.com"; // dummy
  const location =
    "https://www.google.com/maps/search/?api=1&query=Kupwara+Kashmir";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        {/* 🔙 BACK → OPEN DRAWER */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Support</Text>
      </View>

      {/* ================= CONTENT ================= */}

      {/* 📞 CALL */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => Linking.openURL(`tel:${phone}`)}
      >
        <Ionicons name="call-outline" size={28} color="#E6005C" />
        <View style={styles.textBox}>
          <Text style={styles.label}>Call Us</Text>
          <Text style={styles.value}>{phone}</Text>
        </View>
      </TouchableOpacity>

      {/* 📧 EMAIL */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => Linking.openURL(`mailto:${email}`)}
      >
        <Ionicons name="mail-outline" size={28} color="#E6005C" />
        <View style={styles.textBox}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
      </TouchableOpacity>

      {/* 📍 LOCATION */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => Linking.openURL(location)}
      >
        <Ionicons name="location-outline" size={28} color="#E6005C" />
        <View style={styles.textBox}>
          <Text style={styles.label}>Our Location</Text>
          <Text style={styles.value}>Kupwara, Kashmir</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  /* HEADER */
  header: {
    backgroundColor: "#E6005C",
    paddingVertical: 45,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 25,
  },

  backBtn: {
    position: "absolute",
    left: 20,
    top: 45,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  /* SUPPORT CARDS */
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },

  textBox: {
    marginLeft: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },

  value: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
