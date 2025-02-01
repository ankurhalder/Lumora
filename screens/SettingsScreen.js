import React from "react";
import { View, Text, StyleSheet, Switch, Animated, Easing } from "react-native";
import { useThemeColors, useToggleTheme } from "../theme/color";

const SettingsScreen = () => {
  const colors = useThemeColors();
  const toggleTheme = useToggleTheme();
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [colors]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.background, opacity: fadeAnim },
      ]}
    >
      <Text style={[styles.text, { color: colors.text }]}>Settings</Text>

      <View
        style={[
          styles.toggleContainer,
          { borderTopColor: colors.borderInputField },
        ]}
      >
        <Text style={[styles.toggleLabel, { color: colors.text }]}>
          Dark Mode
        </Text>
        <Switch
          value={colors.background === "#121212"}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.borderInputField, true: colors.primary }}
          thumbColor={colors.text}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default SettingsScreen;
