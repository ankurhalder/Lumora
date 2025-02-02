import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useThemeColors } from "../theme/ThemeProvider";

const SkeletonLoaderForComment = ({ count = 3 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const themeColors = useThemeColors();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  const skeletonItems = Array.from({ length: count }, (_, i) => (
    <Animated.View
      key={i}
      style={[
        styles.skeletonItem,
        {
          opacity,
          backgroundColor: themeColors.secondary,
          borderColor: themeColors.cardOutline,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: themeColors.icon }]} />
        <View style={styles.headerText}>
          <View
            style={[styles.usernameLine, { backgroundColor: themeColors.icon }]}
          />
          <View
            style={[styles.timeLine, { backgroundColor: themeColors.icon }]}
          />
        </View>
      </View>
      <View style={styles.body}>
        <View
          style={[styles.textLine, { backgroundColor: themeColors.icon }]}
        />
        <View
          style={[
            styles.textLine,
            { width: "80%", backgroundColor: themeColors.icon },
          ]}
        />
        <View
          style={[
            styles.textLine,
            { width: "90%", backgroundColor: themeColors.icon },
          ]}
        />
      </View>
    </Animated.View>
  ));

  return <View>{skeletonItems}</View>;
};

const styles = StyleSheet.create({
  skeletonItem: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  usernameLine: {
    height: 10,
    width: "50%",
    borderRadius: 5,
    marginBottom: 5,
  },
  timeLine: {
    height: 8,
    width: "30%",
    borderRadius: 5,
  },
  body: {
    marginTop: 5,
  },
  textLine: {
    height: 10,
    width: "100%",
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default SkeletonLoaderForComment;
