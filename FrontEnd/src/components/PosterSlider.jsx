import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const BANNERS = [
  {
    id: "1",
    image: "https://via.placeholder.com/600x300/22c55e/ffffff?text=Free+Delivery",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/600x300/154e2a/ffffff?text=20%25+OFF+Today",
  },
  {
    id: "3",
    image: "https://via.placeholder.com/600x300/22c55e/ffffff?text=Most+Selling+Items",
  },
];

export default function PosterSlider() {
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  /* AUTO SCROLL (NO DEPENDENCY LOOP) */
  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current =
        currentIndex.current === BANNERS.length - 1
          ? 0
          : currentIndex.current + 1;

      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });

      setActiveIndex(currentIndex.current);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      currentIndex.current = viewableItems[0].index;
      setActiveIndex(viewableItems[0].index);
    }
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.banner} />
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* DOTS */}
      <View style={styles.dots}>
        {BANNERS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },

  banner: {
    width: width - 24,
    height: 170,
    borderRadius: 16,
    marginHorizontal: 12,
    backgroundColor: "#eee",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cfcfcf",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#22c55e",
    width: 10,
  },
});
