import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Light Theme Colors
const lightTheme = {
  // General
  background: "#ffffff",
  text: "#212529",
  modalBackground: "#ffffff",
  overlay: "rgba(0,0,0,0.5)",
  icon: "black",
  inactiveTab: "gray",

  // Buttons
  buttonPrimary: "#007bff",
  buttonPrimaryText: "#ffffff",
  buttonSecondary: "#6c757d",
  buttonSecondaryText: "#ffffff",
  buttonDisabled: "#ced4da",
  buttonDisabledText: "#6c757d",

  // Borders & Dividers
  borderLight: "#dee2e6",
  borderMedium: "#ced4da",
  borderDark: "#adb5bd",

  // Skeleton Loader
  skeletonBase: "#f0f0f0",
  skeletonHighlight: "#e0e0e0",

  // Tabs & Navigation
  tabBarBackground: "#ffffff",
  tabBarActiveTint: "#007bff",
  tabBarInactiveTint: "#6c757d",
  tabBarIndicator: "#007bff",

  // Alerts
  alertSuccess: "#d4edda",
  alertSuccessBorder: "#c3e6cb",
  alertWarning: "#fff3cd",
  alertWarningBorder: "#ffeeba",
  alertError: "#f8d7da",
  alertErrorBorder: "#f5c6cb",
};

// Dark Theme Colors
const darkTheme = {
  // General
  background: "#121212",
  text: "#e0e0e0",
  modalBackground: "#1E1E1E",
  overlay: "rgba(255,255,255,0.2)",
  icon: "white",
  inactiveTab: "#AAAAAA",

  // Buttons
  buttonPrimary: "#1e90ff",
  buttonPrimaryText: "#ffffff",
  buttonSecondary: "#343a40",
  buttonSecondaryText: "#ffffff",
  buttonDisabled: "#555",
  buttonDisabledText: "#888",

  // Borders & Dividers
  borderLight: "#333",
  borderMedium: "#444",
  borderDark: "#555",

  // Skeleton Loader
  skeletonBase: "#1e1e1e",
  skeletonHighlight: "#2a2a2a",

  // Tabs & Navigation
  tabBarBackground: "#181818",
  tabBarActiveTint: "#1e90ff",
  tabBarInactiveTint: "#adb5bd",
  tabBarIndicator: "#1e90ff",

  // Alerts
  alertSuccess: "#2e7d32",
  alertSuccessBorder: "#1b5e20",
  alertWarning: "#ff9800",
  alertWarningBorder: "#e65100",
  alertError: "#d32f2f",
  alertErrorBorder: "#b71c1c",
};

// Theme Context & Provider
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme);

  // Load stored theme from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("theme").then((storedTheme) => {
      if (storedTheme) {
        setTheme(storedTheme);
      }
    });
  }, []);

  // Toggle between light & dark theme
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to Get Theme Colors
export const useThemeColors = () => {
  const { theme } = useContext(ThemeContext);
  return theme === "dark" ? darkTheme : lightTheme;
};

// Hook to Toggle Theme
export const useToggleTheme = () => {
  const { toggleTheme } = useContext(ThemeContext);
  return toggleTheme;
};
