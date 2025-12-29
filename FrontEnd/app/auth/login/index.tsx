import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/api/context/authContext";

export default function Login() {
  const { login, verifyOtp } = useContext(AuthContext);
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      return Toast.show({
        type: "error",
        text1: "Invalid Number",
        text2: "Enter valid 10 digit number",
      });
    }

    try {
      setLoading(true);
      const res = await login(phone);

      if (res.success) {
        setOtpSent(true);

        // 🔴 DEV MODE: SHOW OTP
        Toast.show({
          type: "success",
          text1: "OTP Sent",
          text2: `OTP: ${res.otp}`, // ⚠️ remove in production
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Failed to send OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      return Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "OTP must be 6 digits",
      });
    }

    try {
      setLoading(true);
      const res = await verifyOtp({ phone, otp });

      if (res.success) {
        Toast.show({
          type: "success",
          text1: "Login Successful",
        });

        if (res.user.role === "admin") {
          router.replace("/admin");
        } else if (res.user.role === "restaurant") {
          router.replace("/restaurant");
        } else {
          router.replace("/user/(tabs)/home");
        }
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "OTP Verification Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* 🔼 TOP IMAGE */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1542838132-92c53300491e",
          }}
          style={styles.bgImage}
        />

        {/* 🔽 BOTTOM CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>

          {/* ================= PHONE ================= */}
          {!otpSent && (
            <>
              <View style={styles.inputBox}>
                <Text style={styles.country}>🇮🇳 +91</Text>
                <TextInput
                  placeholder="ENTER PHONE NO"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={(t) =>
                    setPhone(t.replace(/[^0-9]/g, ""))
                  }
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  selectionColor="#22c55e"
                />
              </View>

              <TouchableOpacity
                style={styles.btn}
                onPress={handleSendOtp}
                disabled={loading}
              >
                <Text style={styles.btnText}>
                  {loading ? "Sending..." : "Login"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* ================= OTP ================= */}
          {otpSent && (
            <>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="ENTER OTP"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  selectionColor="#22c55e"
                />
              </View>

              <TouchableOpacity
                style={styles.btn}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                <Text style={styles.btnText}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSendOtp}>
                <Text style={styles.resend}>Resend OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  bgImage: {
    width: "100%",
    height: "55%",
  },

  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
    color: "#111827",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#22c55e",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },

  country: {
    marginRight: 10,
    fontSize: 15,
  },

  input: {
    flex: 1,
    fontSize: 14,
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingVertical: 0,
    color: "#111",
  },

  btn: {
    backgroundColor: "#22c55e",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  resend: {
    textAlign: "center",
    marginTop: 14,
    color: "#22c55e",
    fontWeight: "600",
  },
});
