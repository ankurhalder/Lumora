import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TopTabNavigator from "./TopTabNavigator";

function RootNavigator() {
  return (
    <NavigationContainer>
      <TopTabNavigator />
    </NavigationContainer>
  );
}

export default RootNavigator;
