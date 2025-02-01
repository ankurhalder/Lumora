import { useColorScheme } from "react-native";

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

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
};
