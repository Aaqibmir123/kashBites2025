import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 25,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 220,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 6,
    color: "#555",
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    marginTop: 20,
    borderRadius: 12,
    fontSize: 18,
    backgroundColor: "#fafafa",
  },
  btn: {
    width: "100%",
    marginTop: 22,
    backgroundColor: "#ff4b3a",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  signupText: {
    fontSize: 17,
    marginTop: 25,
    textDecorationLine: "underline",
  },
});
