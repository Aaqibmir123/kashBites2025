import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CustomAdminDrawer(props) {
  const router = useRouter();

  const goTo = (route) => {
    props.navigation.closeDrawer();
    router.replace(route);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* ================= TOP BACK BAR ================= */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => goTo("/admin")}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>
      </View>

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Admin Panel</Text>
        <Text style={styles.email}>Manage KashBites</Text>
      </View>

      {/* ================= MENU ================= */}
      <View style={{ marginTop: 20 }}>
        <DrawerItem
          icon="person-outline"
          title="Profile"
          onPress={() => goTo("/admin/profile")}
        />

        <DrawerItem
          icon="speedometer-outline"
          title="Dashboard"
          onPress={() => goTo("/admin/dashboard")}
        />

        <DrawerItem
          icon="receipt-outline"
          title="Orders"
          onPress={() => goTo("/admin")}
        />

        <DrawerItem
          icon="restaurant-outline"
          title="Add Restaurant"
          onPress={() => goTo("/admin/(tabs)/add-restaurant")}
        />
      </View>

      {/* ================= LOGOUT ================= */}
      <View style={styles.footer}>
        <DrawerItem
          icon="log-out-outline"
          title="Logout"
          danger
          onPress={() => goTo("/auth/login")}
        />
      </View>
    </DrawerContentScrollView>
  );
}

/* ================= DRAWER ITEM ================= */
function DrawerItem({ icon, title, onPress, danger }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, danger && styles.logoutItem]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* LEFT ICON */}
      <Ionicons
        name={icon}
        size={22}
        color={danger ? "#E53935" : "#333"}
      />

      {/* TITLE */}
      <Text style={[styles.menuText, danger && styles.logoutText]}>
        {title}
      </Text>

      {/* RIGHT ARROW */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={danger ? "#E53935" : "#999"}
      />
    </TouchableOpacity>
  );
}

/* ================= STYLES (USER DRAWER COPY) ================= */

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  header: {
    alignItems: "center",
    paddingVertical: 25,
    backgroundColor: "#f7f7f7",
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  email: {
    fontSize: 13,
    color: "#777",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },

  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingBottom: 20,
  },

  logoutItem: {
    backgroundColor: "#FFF5F5",
  },

  logoutText: {
    color: "#E53935",
    fontWeight: "bold",
  },
});
