import { Fragment } from "react";
import { StyleSheet, View, Text, StatusBar } from "react-native";
import RootNavigator from "./navigation/RootNavigator";
export default function App() {
  return (
    <Fragment>
      <StatusBar style="auto" backgroundColor="#6a51ae" />
      <RootNavigator></RootNavigator>
    </Fragment>
  );
}

const styles = StyleSheet.create({});
