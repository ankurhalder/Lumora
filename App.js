import React, { Fragment, useContext } from "react";
import { StatusBar } from "react-native";
import RootNavigator from "./navigation/RootNavigator";
import {
  ThemeProvider,
  useThemeColors,
  ThemeContext,
} from "./theme/ThemeProvider";

const AppContent = () => {
  const colors = useThemeColors();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <Fragment>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <RootNavigator />
    </Fragment>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
