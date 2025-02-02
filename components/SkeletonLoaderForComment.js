import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const SkeletonLoaderForComment = ({ count = 3 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

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
    <Animated.View key={i} style={[styles.skeletonItem, { opacity }]}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerText}>
          <View style={styles.usernameLine} />
          <View style={styles.timeLine} />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.textLine} />
        <View style={[styles.textLine, { width: "80%" }]} />
        <View style={[styles.textLine, { width: "90%" }]} />
      </View>
    </Animated.View>
  ));

  return <View>{skeletonItems}</View>;
};

const styles = StyleSheet.create({
  skeletonItem: {
    backgroundColor: "#E0E0E0",
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
    backgroundColor: "#C0C0C0",
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  usernameLine: {
    height: 10,
    width: "50%",
    backgroundColor: "#C0C0C0",
    borderRadius: 5,
    marginBottom: 5,
  },
  timeLine: {
    height: 8,
    width: "30%",
    backgroundColor: "#C0C0C0",
    borderRadius: 5,
  },
  body: {
    marginTop: 5,
  },
  textLine: {
    height: 10,
    width: "100%",
    backgroundColor: "#C0C0C0",
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default SkeletonLoaderForComment;
