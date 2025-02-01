import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { withTiming, useSharedValue } from "react-native-reanimated";

const lightTheme = {
  background: "#ffffff",
  text: "#212529",
  modalBackground: "#ffffff",
  overlay: "rgba(0,0,0,0.5)",
  icon: "black",
  inactiveTab: "gray",
  primary: "#007bff",
  secondary: "#6c757d",
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
  info: "#17a2b8",
  accentPurple: "#6f42c1",
  accentTeal: "#20c997",
  accentPink: "#e83e8c",
  chatBubbleSent: "#dcf8c6",
  chatBubbleReceived: "#f1f0f0",
  mentionHighlight: "#ffeb3b",
  timestamp: "#6c757d",
  shadowLight: "rgba(0, 0, 0, 0.1)",
  shadowMedium: "rgba(0, 0, 0, 0.2)",
  shadowDark: "rgba(0, 0, 0, 0.3)",
  tabBarHover: "#e9ecef",
  tabBarActiveBackground: "#f8f9fa",
  borderInputField: "#ced4da",
  cardOutline: "#adb5bd",
};

const darkTheme = {
  background: "#121212",
  text: "#e0e0e0",
  modalBackground: "#1E1E1E",
  overlay: "rgba(255,255,255,0.2)",
  icon: "white",
  inactiveTab: "#AAAAAA",
  primary: "#1e90ff",
  secondary: "#343a40",
  success: "#2e7d32",
  warning: "#ff9800",
  error: "#d32f2f",
  info: "#0288d1",
  accentPurple: "#9c27b0",
  accentTeal: "#009688",
  accentPink: "#e91e63",
  chatBubbleSent: "#2e7d32",
  chatBubbleReceived: "#263238",
  mentionHighlight: "#ffeb3b",
  timestamp: "#adb5bd",
  shadowLight: "rgba(255, 255, 255, 0.1)",
  shadowMedium: "rgba(255, 255, 255, 0.2)",
  shadowDark: "rgba(255, 255, 255, 0.3)",
  tabBarHover: "#1f1f1f",
  tabBarActiveBackground: "#292929",
  borderInputField: "#444",
  cardOutline: "#555",
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme);
  const opacity = useSharedValue(1);

  useEffect(() => {
    AsyncStorage.getItem("theme").then((storedTheme) => {
      if (storedTheme) setTheme(storedTheme);
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";

    opacity.value = withTiming(0, { duration: 300 });

    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);

    opacity.value = withTiming(1, { duration: 300 });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>
    </ThemeContext.Provider>
  );
};

export const useThemeColors = () => {
  const { theme } = useContext(ThemeContext);
  return theme === "dark" ? darkTheme : lightTheme;
};

export const useToggleTheme = () => {
  const { toggleTheme } = useContext(ThemeContext);
  return toggleTheme;
};
