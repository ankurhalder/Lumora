import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import profileScreen from "../screens/ProfileScreen";
import ProfileDetailScreen from "../screens/PostDetailsScreen";

const Stack = createStackNavigator();

const ProfileStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={profileScreen} />
    <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
  </Stack.Navigator>
);

export default ProfileStackNavigator;
