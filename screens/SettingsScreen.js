import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useThemeColors, useToggleTheme } from "../theme/color";

const SettingsScreen = () => {
  const colors = useThemeColors();
  const toggleTheme = useToggleTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>Settings</Text>

      <View style={styles.switchContainer}>
        <Text style={{ color: colors.text }}>Dark Mode</Text>
        <Switch
          value={colors.background === "#121212"}
          onValueChange={toggleTheme}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default SettingsScreen;
