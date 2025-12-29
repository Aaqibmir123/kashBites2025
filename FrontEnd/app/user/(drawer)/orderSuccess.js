import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useContext } from "react";

import { AuthContext } from "@/src/api/context/authContext";

export default function OrderSuccess() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  /* 🔔 Send notification once when page loads */
  useEffect(() => {
    if (user?._id) {
      sendOrderSuccessNotification();
    }
  }, []);

  const sendOrderSuccessNotification = async () => {
    try {
      await fetch(
        "http://10.96.245.173:5000/api/notifications/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            title: "Order Placed ✅",
            body:
              "Your order has been placed successfully. Thank you for ordering ❤️",
          }),
        }
      );
    } catch (err) {
      console.log("❌ Notification error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bigEmoji}>🎉</Text>
      <Text style={styles.title}>Order Placed Successfully!</Text>
      <Text style={styles.subtitle}>Thank you for ordering ❤️</Text>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => router.replace("/user/home")}
      >
        <Text style={styles.homeText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===== STYLES ===== */
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
