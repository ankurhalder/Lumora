import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const lightTheme = {
  background: "white",
  text: "#007bff",
  modalBackground: "white",
  overlay: "rgba(0,0,0,0.5)",
  icon: "black",
  inactiveTab: "gray",
};

const darkTheme = {
  background: "#121212",
  text: "#1E90FF",
  modalBackground: "#1E1E1E",
  overlay: "rgba(255,255,255,0.2)",
  icon: "white",
  inactiveTab: "#AAAAAA",
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme);

  useEffect(() => {
    AsyncStorage.getItem("theme").then((storedTheme) => {
      if (storedTheme) {
        setTheme(storedTheme);
      }
    });
  }, []);

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

export const useThemeColors = () => {
  const { theme } = useContext(ThemeContext);
  return theme === "dark" ? darkTheme : lightTheme;
};

export const useToggleTheme = () => {
  const { toggleTheme } = useContext(ThemeContext);
  return toggleTheme;
};
