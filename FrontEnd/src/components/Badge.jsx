import { View, Text } from "react-native";

export default function Badge({ count }) {
  if (!count || count <= 0) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: -6,
        right: -10,
        backgroundColor: "#E53935",
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
        {count}
      </Text>
    </View>
  );
}
