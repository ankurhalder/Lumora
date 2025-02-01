import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useThemeColors, useToggleTheme } from "../theme/ThemeProvider";

const SettingsScreen = () => {
  const colors = useThemeColors();
  const toggleTheme = useToggleTheme();

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(colors.background, { duration: 500 }),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: withTiming(colors.text, { duration: 500 }),
  }));

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Animated.Text style={[styles.text, animatedTextStyle]}>
        Settings
      </Animated.Text>

      <View style={styles.spacer} />

      <View
        style={[
          styles.toggleContainer,
          {
            backgroundColor: colors.modalBackground,
            borderColor: colors.cardOutline,
            shadowColor: colors.shadowDark,
          },
        ]}
      >
        <Text style={[styles.toggleLabel, { color: colors.text }]}>
          Dark Mode
        </Text>
        <Switch
          value={colors.background === "#121212"}
          onValueChange={toggleTheme}
          trackColor={{
            false: colors.borderInputField,
            true: colors.primary,
          }}
          thumbColor={"#007bff"}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
  },
  spacer: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 30,
  },
  toggleLabel: {
    fontSize: 20,
    fontWeight: "500",
  },
});

export default SettingsScreen;
