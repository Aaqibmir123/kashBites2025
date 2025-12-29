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
    <View style={styles.root}>
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
      <ScrollView contentContainerStyle={styles.content}>
        {/* 📞 CALL */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => Linking.openURL(`tel:${phone}`)}
        >
          <Ionicons name="call-outline" size={28} color="#22c55e" />
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
          <Ionicons name="mail-outline" size={28} color="#22c55e" />
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
          <Ionicons name="location-outline" size={28} color="#22c55e" />
          <View style={styles.textBox}>
            <Text style={styles.label}>Our Location</Text>
            <Text style={styles.value}>Kupwara, Kashmir</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  /* HEADER */
  header: {
    backgroundColor: "#22c55e", // ✅ GREEN THEME
    paddingVertical: 45,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  backBtn: {
    position: "absolute",
    left: 16,
    top: 45,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  /* CONTENT */
  content: {
    padding: 20,
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
    fontWeight: "700",
    color: "#333",
  },

  value: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
