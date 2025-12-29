import React, { useContext, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../api/context/authContext";
import NotificationBell from "./NotificationBell";
import { BASE_IMAGE_URL } from "../api/apiConfig";

export default function AppHeader({ onSearch }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const inputRef = useRef(null);
  const [search, setSearch] = useState("");

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "M";
  const role = user?.role;

  const profileImage =
    user?.image ? `${BASE_IMAGE_URL}${user.image}` : null;

  return (
    <View style={styles.header}>
      {/* 🔍 SEARCH */}
      <Pressable
        style={styles.searchWrapper}
        onPress={() => inputRef.current?.focus()}
      >
        <View pointerEvents="none" style={styles.fakeSearch}>
          <Ionicons name="search-outline" size={18} color="#6b7280" />
          <Text style={styles.fakeText}>
            {search.length > 0 ? search : "Search"}
          </Text>
        </View>

        <TextInput
          ref={inputRef}
          value={search}
          onChangeText={(t) => {
            setSearch(t);
            onSearch && onSearch(t);
          }}
          style={styles.realInput}
          autoCorrect={false}
          autoComplete="off"
          importantForAutofill="no"
        />
      </Pressable>

      {/* 🔔 + 👤 PROFILE */}
      <View style={styles.rightIcons}>
        <NotificationBell role={role} />

        <TouchableOpacity
          style={styles.profileCircle}
          onPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.profileText}>{firstLetter}</Text>
          )}
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
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    elevation: 4,
  },

  /* SEARCH */
  searchWrapper: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
  },

  fakeSearch: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  fakeText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#111",
  },

  realInput: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.01,
    color: "transparent",
    paddingHorizontal: 12,
    fontSize: 14,
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    overflow: "hidden", // 👈 important for image
  },

  profileText: {
    color: "#166534",
    fontSize: 15,
    fontWeight: "700",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
