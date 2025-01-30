import { Fragment } from "react";
import { StyleSheet, View, Text, StatusBar } from "react-native";

export default function App() {
  return (
    <Fragment>
      <StatusBar style="auto" backgroundColor="#6a51ae" />
      <View>
        <Text>Hello World</Text>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({});
