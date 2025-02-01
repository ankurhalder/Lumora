import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useThemeColors, useToggleTheme } from "../theme/color";

function SettingsScreen() {
  const colors = useThemeColors();
  const toggleTheme = useToggleTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          onValueChange={toggleTheme}
          value={colors.background === "#121212"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
  },
});

export default SettingsScreen;
