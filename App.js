import { Fragment } from "react";
import { StyleSheet, StatusBar } from "react-native";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  return (
    <Fragment>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <RootNavigator />
    </Fragment>
  );
}

const styles = StyleSheet.create({});
