import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

const SkeletonLoader = ({ count = 5 }) => {
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
    <View style={styles.container}>
      {[...Array(count)].map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.skeletonPost, { opacity: fadeAnim }]}
        >
          <View style={styles.header}>
            <View style={styles.skeletonProfile} />
            <View style={styles.skeletonTextContainer}>
              <View style={styles.skeletonName} />
              <View style={styles.skeletonTimestamp} />
            </View>
          </View>

          <View style={styles.skeletonPostContent} />
          <View style={[styles.skeletonPostContent, { width: "70%" }]} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  skeletonPost: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  skeletonProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  skeletonTextContainer: {
    marginLeft: 10,
  },
  skeletonName: {
    width: 100,
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 4,
  },
  skeletonTimestamp: {
    width: 60,
    height: 10,
    backgroundColor: "#ddd",
    marginTop: 5,
    borderRadius: 4,
  },
  skeletonPostContent: {
    width: "100%",
    height: 12,
    backgroundColor: "#ddd",
    marginTop: 10,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
