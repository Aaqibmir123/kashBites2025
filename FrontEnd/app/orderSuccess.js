import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.bigEmoji}>🎉</Text>
      <Text style={styles.title}>Order Placed Successfully!</Text>
      <Text style={styles.subtitle}>Thank you for ordering ❤️</Text>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => router.replace("/(drawer)/(tabs)/home")}
      >
        <Text style={styles.homeText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  bigEmoji: { fontSize: 80, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#555", marginBottom: 30 },

  homeBtn: {
    backgroundColor: "#FF6347",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  homeText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
