import React from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default function HomeSlider() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/banner.png")}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  image: {
    width: width - 20,
    height: 260,              // ✅ MORE HEIGHT
    alignSelf: "center",
    borderRadius: 18,
    resizeMode: "cover",      // ✅ IMAGE PROPERLY FILL
  },
});
