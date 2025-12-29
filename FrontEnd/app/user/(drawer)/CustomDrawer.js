import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { AuthContext } from "../../../src/api/context/authContext";
import { BASE_IMAGE_URL } from "../../../src/api/apiConfig.js";

export default function CustomDrawer(props) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = (route) => {
    props.navigation.closeDrawer();
    router.push(route);
  };

  return (
    <>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.container}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => {
              props.navigation.closeDrawer();
              router.replace("/user/(tabs)/home");
            }}
          >
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Image
            source={{
              uri: user?.image
                ? `${BASE_IMAGE_URL}${user.image}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            {user?.name || "KashBites User"}
          </Text>
          <Text style={styles.email}>
            {user?.email || "welcome@kashbites.com"}
          </Text>
        </View>

        {/* ================= MENU ================= */}
        <View style={styles.menu}>
          <MenuItem
            label="Profile"
            icon="person-outline"
            onPress={() => navigate("/user/(drawer)/profile")}
          />
          <MenuItem
            label="Support"
            icon="help-circle-outline"
            onPress={() => navigate("/user/(drawer)/support")}
          />
          <MenuItem
            label="Live Chat"
            icon="chatbubble-ellipses-outline"
            onPress={() => navigate("/user/(drawer)/LiveChat")}
          />
        </View>

        {/* ================= LOGOUT ================= */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <View style={styles.logoutIcon}>
              <Ionicons name="log-out-outline" size={22} color="#b91c1c" />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* ================= LOGOUT MODAL ================= */}
      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color="#dc2626"
              style={{ marginBottom: 10 }}
            />

            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  setShowLogoutModal(false);
                  navigate("/user/(drawer)/logout");
                }}
              >
                <Text style={styles.confirmText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );

  function MenuItem({ label, icon, onPress }) {
    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Ionicons name={icon} size={22} color="#15803d" />
        <Text style={styles.menuText}>{label}</Text>
        <Ionicons name="chevron-forward" size={18} color="#86efac" />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },

  /* ===== HEADER ===== */
  header: {
    backgroundColor: "#22c55e",
    paddingTop: 50,
    paddingBottom: 32,
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  backIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  email: {
    fontSize: 13,
    color: "#ecfdf5",
  },

  /* ===== MENU ===== */
  menu: {
    marginTop: 28,
    paddingHorizontal: 16,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },

  menuText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "500",
    color: "#166534",
  },

  /* ===== LOGOUT ===== */
  logoutSection: {
    marginTop: "auto",
    padding: 16,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
  },

  logoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#b91c1c",
  },

  /* ===== MODAL ===== */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  modalMessage: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
    alignItems: "center",
  },

  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },

  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#dc2626",
    marginLeft: 8,
    alignItems: "center",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
