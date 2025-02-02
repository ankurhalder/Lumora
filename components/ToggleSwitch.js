import React, { useEffect } from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const ToggleSwitch = ({
  isOn,
  onToggle,
  trackColor,
  thumbColor,
  width = 60,
  height = 30,
  springConfig = { stiffness: 350, damping: 20, mass: 1 },
}) => {
  const translateX = useSharedValue(isOn ? width - height : 0);
  useEffect(() => {
    translateX.value = withSpring(isOn ? width - height : 0, springConfig);
  }, [isOn, width, height, springConfig, translateX]);
  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <Animated.View
        style={[
          styles.track,
          {
            width,
            height,
            borderRadius: height / 2,
            backgroundColor: trackColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: height,
              height,
              borderRadius: height / 2,
              backgroundColor: thumbColor,
            },
            animatedThumbStyle,
          ]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  track: {
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default ToggleSwitch;
