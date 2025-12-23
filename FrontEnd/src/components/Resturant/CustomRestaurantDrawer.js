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

export default function CustomRestaurantDrawer(props) {
  const router = useRouter();

  /* 🔙 BACK TO ORDERS (TABS ROOT) */
  const goBackToOrders = () => {
    props.navigation.closeDrawer();
    router.replace("/restaurant");
  };

  /* 👉 MENU ITEM */
  const MenuItem = ({ icon, title, route }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        props.navigation.closeDrawer();
        router.replace(route);
      }}
      activeOpacity={0.7}
    >
      {/* LEFT ICON */}
      <Ionicons name={icon} size={22} color="#333" />

      {/* TITLE */}
      <Text style={styles.menuText}>{title}</Text>

      {/* RIGHT ARROW */}
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* ===== TOP BACK BAR ===== */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBackToOrders}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>
      </View>

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Restaurant Panel</Text>
        <Text style={styles.email}>Manage your restaurant</Text>
      </View>

      {/* ===== MENU (ONLY SECONDARY OPTIONS) ===== */}
      <View style={{ marginTop: 20 }}>
        <MenuItem
          icon="speedometer-outline"
          title="Dashboard"
          route="/restaurant/dashboard"
        />

        <MenuItem
          icon="person-outline"
          title="Profile"
          route="/restaurant/profile"
        />

        <MenuItem
          icon="location-outline"
          title="Address"
          route="/restaurant/address"
        />

        <MenuItem
          icon="help-circle-outline"
          title="Support"
          route="/restaurant/support"
        />
      </View>

      {/* ===== LOGOUT ===== */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            props.navigation.closeDrawer();
            router.replace("/auth/login");
          }}
        >
          <Ionicons name="log-out-outline" size={22} color="#ff4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  /* TOP BACK */
  topBar: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  /* HEADER */
  header: {
    alignItems: "center",
    paddingVertical: 30,
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

  /* MENU */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },

  /* FOOTER */
  footer: {
    marginTop: "auto",
    paddingLeft: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
  },

  logoutText: {
    marginLeft: 10,
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "500",
  },
});
