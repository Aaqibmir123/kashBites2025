import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../src/api/context/authContext";
import { BASE_IMAGE_URL } from "../../src/api/constants/endpoints";

export default function CustomDrawer(props) {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        {/* BACK TO HOME */}
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => {
            props.navigation.closeDrawer();
            router.replace("/(tabs)/home");
          }}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* PROFILE IMAGE */}
        <Image
          source={{
            uri: user?.image
              ? `${BASE_IMAGE_URL}${user.image}`
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{user?.name || "KashBites User"}</Text>
        <Text style={styles.sub}>
          {user?.email || "welcome@kashbites.com"}
        </Text>
      </View>

      {/* ================= MENU ================= */}
      <View style={styles.menu}>
        <DrawerItem
          label="Profile"
          icon="person-outline"
          route="/(drawer)/profile"
        />

        <DrawerItem
          label="Support"
          icon="help-circle-outline"
          route="/(drawer)/support"
        />

        <DrawerItem
          label="Live Chat"
          icon="chatbubble-ellipses-outline"
          route="/(drawer)/LiveChat"
        />
      </View>

      {/* ================= LOGOUT ================= */}
      <View style={styles.logoutBox}>
        <DrawerItem
          label="Logout"
          icon="log-out-outline"
          route="/(drawer)/logout"
          danger
        />
      </View>
    </DrawerContentScrollView>
  );

  /* ================= DRAWER ITEM ================= */
  function DrawerItem({ label, route, icon, danger }) {
    return (
      <TouchableOpacity
        style={[styles.item, danger && styles.logoutItem]}
        onPress={() => {
          props.navigation.closeDrawer();
          router.push(route);
        }}
      >
        {/* LEFT ICON */}
        <Ionicons
          name={icon}
          size={22}
          color={danger ? "#E53935" : "#333"}
        />

        {/* TEXT */}
        <Text style={[styles.itemText, danger && styles.logoutText]}>
          {label}
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
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E6005C",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    position: "relative",
  },

  backIcon: {
    position: "absolute",
    right: 15,
    top: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  sub: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.9,
  },

  menu: {
    marginTop: 25,
  },

  item: {
    flexDirection: "row",
    alignItems: "center", // ✅ center vertically
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  itemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#111",
  },

  logoutBox: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  logoutItem: {
    backgroundColor: "#FFF5F5",
  },

  logoutText: {
    color: "#E53935",
    fontWeight: "bold",
  },
});
