import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../api/context/authContext";
import NotificationBell from "./NotificationBell";

export default function AppHeader({ title = "" }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "M";

  return (
    <View style={styles.header}>
      {/* LEFT SPACE */}
      <View style={{ width: 40 }} />

      {/* TITLE */}
      <Text style={styles.title}>{title}</Text>

      {/* 🔥 RIGHT ICONS (BELL + PROFILE) */}
      <View style={styles.rightIcons}>
        {/* 🔔 NOTIFICATION BELL */}
        <NotificationBell />

        {/* 👤 PROFILE ICON */}
        <TouchableOpacity
          style={styles.profileCircle}
          onPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        >
          <Text style={styles.profileText}>{firstLetter}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    elevation: 4,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: "#444",
    fontSize: 15,
    fontWeight: "700",
  },
});
