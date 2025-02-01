import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

const SkeletonLoader = ({ count = 5, style = {} }) => {
  const fadeAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.6,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View>
      {[...Array(count)].map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.skeletonContainer, { opacity: fadeAnim }, style]}
        >
          <View style={styles.skeletonProfile} />
          <View style={styles.skeletonTextContainer}>
            <View style={styles.skeletonText} />
            <View style={[styles.skeletonText, { width: "50%" }]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  skeletonProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  skeletonTextContainer: { marginLeft: 10 },
  skeletonText: {
    width: 120,
    height: 12,
    backgroundColor: "#ddd",
    marginTop: 6,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
