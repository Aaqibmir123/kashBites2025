import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/api/context/authContext";
import { loginStyles as styles } from "./loginStyles";

export default function Login() {
  const { login, verifyOtp } = useContext(AuthContext);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      return Toast.show({
        type: "error",
        text1: "Invalid Number",
        text2: "Enter a valid 10 digit number",
      });
    }
    try {
      const res = await login(phone);
      if (res.success) {
        setOtpSent(true);
        Toast.show({ type: "success", text1: "OTP Sent!", text2: `OTP: ${res.otp}` });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Something went wrong" });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      return Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "OTP must be 6 digits",
      });
    }
    try {
      const res = await verifyOtp({ phone, otp });
      console.log(res,'response')
      if (res.success) {
        Toast.show({ type: "success", text1: "Logged In Successfully" });
        if (res.user.role === "admin") router.replace("/admin");
        else if (res.user.role === "restaurant") router.replace("/restaurant");
        else router.replace("/(tabs)/home");
      }
    } catch {
      Toast.show({ type: "error", text1: "Verification Failed" });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* <Image
          source={require("../../../assets/images/login.png")} // Use any login png
          style={styles.logo}
        /> */}
        <Text style={styles.title}>Welcome to KashBites</Text>
        <Text style={styles.subtitle}>Login or Sign Up</Text>

        {!otpSent && (
          <>
            <TextInput
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
              style={styles.input}
            />
            <TouchableOpacity style={styles.btn} onPress={handleSendOtp}>
              <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}

        {otpSent && (
          <>
            <TextInput
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              style={styles.input}
            />
            <TouchableOpacity style={styles.btn} onPress={handleVerifyOtp}>
              <Text style={styles.btnText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
