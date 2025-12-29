import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TopHeader({
  title = "",
  backTo,           // 👈 fixed route
  bgColor = "#D81B60",
  iconColor = "#fff",
}) {
  const router = useRouter();

  return (
    <View style={[styles.header, { backgroundColor: bgColor }]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          if (backTo) {
            router.replace(backTo); // ✅ fixed navigation
          } else {
            router.back();
          }
        }}
      >
        <Ionicons name="arrow-back" size={22} color={iconColor} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: iconColor }]}>
        {title}
      </Text>

      {/* right spacing */}
      <View style={{ width: 32 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
