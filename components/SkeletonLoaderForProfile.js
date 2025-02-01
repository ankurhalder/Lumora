import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { useThemeColors } from "../theme/ThemeProvider";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SkeletonLoaderForProfile = () => {
  const colors = useThemeColors();
  const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnimatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    shimmerLoop.start();
    return () => shimmerLoop.stop();
  }, [shimmerAnimatedValue]);

  const shimmerTranslate = shimmerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  const renderShimmer = (style) => (
    <View
      style={[
        styles.shimmerContainer,
        style,
        { backgroundColor: colors.cardOutline },
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
            backgroundColor: colors.background,
          },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        {renderShimmer(styles.profileImageSkeleton)}
        <View style={styles.profileTextContainer}>
          {renderShimmer(styles.profileNameSkeleton)}
          {renderShimmer(styles.profileUsernameSkeleton)}
        </View>
      </View>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={styles.postContainer}>
          {renderShimmer(styles.postTitleSkeleton)}
          {renderShimmer(styles.postBodySkeleton)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  shimmerContainer: {
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    height: "100%",
    width: "100%",
  },
  profileHeader: {
    flexDirection: "row",
    marginBottom: 20,
  },
  profileImageSkeleton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileNameSkeleton: {
    width: "60%",
    height: 20,
    borderRadius: 4,
    marginBottom: 10,
  },
  profileUsernameSkeleton: {
    width: "40%",
    height: 16,
    borderRadius: 4,
  },
  postContainer: {
    marginBottom: 20,
  },
  postTitleSkeleton: {
    width: "80%",
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  postBodySkeleton: {
    width: "100%",
    height: 60,
    borderRadius: 4,
  },
});

export default SkeletonLoaderForProfile;
