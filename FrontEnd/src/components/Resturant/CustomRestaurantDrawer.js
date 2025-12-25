import React, { useContext } from "react";
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

import { AuthContext } from "@/src/api/context/authContext";
import { BASE_IMAGE_URL } from "@/src/api/constants/endpoints";

export default function CustomRestaurantDrawer(props) {
  const router = useRouter();
  const { user } = useContext(AuthContext);

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
      <Ionicons name={icon} size={22} color="#333" />
      <Text style={styles.menuText}>{title}</Text>
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
            uri: user?.image
              ? `${BASE_IMAGE_URL}${user.image}`
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>
          {user?.name || "Restaurant Panel"}
        </Text>

        <Text style={styles.email}>
          {user?.email || "Manage your restaurant"}
        </Text>
      </View>

      {/* ===== MENU ===== */}
      <View style={{ marginTop: 20 }}>
        <MenuItem
          icon="grid-outline"
          title="Dashboard"
          route="/restaurant/dashboard"
        />

      

        <MenuItem
          icon="fast-food-outline"
          title="Add Products"
          route="/restaurant/add-product"
        />

        <MenuItem
          icon="person-circle-outline"
          title="Profile"
          route="/restaurant/profile"
        />

      

        <MenuItem
          icon="map-outline"
          title="Address"
          route="/restaurant/address"
        />

        <MenuItem
          icon="headset-outline"
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
  topBar: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

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
