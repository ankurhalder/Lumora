import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useThemeColors } from "../theme/ThemeProvider";

const SkeletonLoader = ({ count = 5 }) => {
  const fadeAnim = useRef(new Animated.Value(0.6)).current;
  const { secondary, background, borderInputField, inactiveTab } =
    useThemeColors();

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
          style={[
            styles.skeletonPost,
            { opacity: fadeAnim, backgroundColor: secondary },
          ]}
        >
          <View style={styles.header}>
            <View
              style={[styles.skeletonProfile, { backgroundColor: inactiveTab }]}
            />
            <View style={styles.skeletonTextContainer}>
              <View
                style={[styles.skeletonName, { backgroundColor: inactiveTab }]}
              />
              <View
                style={[
                  styles.skeletonTimestamp,
                  { backgroundColor: inactiveTab },
                ]}
              />
            </View>
          </View>

          <View
            style={[
              styles.skeletonPostContent,
              { backgroundColor: inactiveTab },
            ]}
          />
          <View
            style={[
              styles.skeletonPostContent,
              { width: "70%", backgroundColor: inactiveTab },
            ]}
          />
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
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
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
  },
  skeletonTextContainer: {
    marginLeft: 10,
  },
  skeletonName: {
    width: 100,
    height: 12,
    borderRadius: 4,
  },
  skeletonTimestamp: {
    width: 60,
    height: 10,
    marginTop: 5,
    borderRadius: 4,
  },
  skeletonPostContent: {
    width: "100%",
    height: 12,
    marginTop: 10,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
