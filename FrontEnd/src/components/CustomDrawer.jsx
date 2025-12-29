import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../src/api/context/authContext";
import { getProfileApi } from "../../src/api/profileApi";
import { BASE_IMAGE_URL } from "../../src/api/apiConfig.js"

export default function CustomDrawer(props) {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const userId = user?._id;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: null,
  });

  /* ================= GET PROFILE ================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfileApi({userId}); // userId backend se token se aa raha hai

      setProfile({
        name: res?.name || user?.name || "",
        email: res?.email || user?.email || "",
        image: res?.image || null,
      });
    } catch (err) {
      console.log("Drawer profile error:", err);
    }
  };

  const MenuItem = ({ icon, title, route }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        props.navigation.closeDrawer();
        router.push(route);
      }}
    >
      <Ionicons name={icon} size={22} color="#333" />
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* ===== HEADER ===== */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          props.navigation.closeDrawer();
          router.push("/(drawer)/profile");
        }}
        activeOpacity={0.8}
      >
        <Image
          source={{
            uri: profile.image
              ? `${BASE_IMAGE_URL}${profile.image}`
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </TouchableOpacity>

      {/* ===== MENU ===== */}
      <View style={{ marginTop: 20 }}>
      

        <MenuItem
          icon="person-outline"
          title="Profile"
          route="/(drawer)/profile"
        />

        <MenuItem
          icon="receipt-outline"
          title="Orders"
          route="/(drawer)/orders"
        />
      </View>

      {/* ===== LOGOUT ===== */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            props.navigation.closeDrawer();
            logout(); // ✅ context logout
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
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },

  footer: {
    marginTop: "auto",
    paddingLeft: 20,
    paddingBottom: 20,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoutText: {
    marginLeft: 10,
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "500",
  },
});
