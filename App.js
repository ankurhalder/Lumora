import { Fragment } from "react";
import { StyleSheet, StatusBar } from "react-native";
import RootNavigator from "./navigation/AppNavigator";
import { ThemeProvider } from "./theme/color";
export default function App() {
  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Fragment>
  );
}

const styles = StyleSheet.create({});
