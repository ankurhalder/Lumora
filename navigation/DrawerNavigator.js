import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CustomDrawerContent from "./CustomDrawerContent";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const statusBarHeight = StatusBar.currentHeight;

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerPosition="right" // This ensures the drawer is on the right side
      drawerType="front" // Optional: ensures it slides over content, not behind it
      drawerContent={(props) => (
        <CustomDrawerContent {...props} statusBarHeight={statusBarHeight} />
      )}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
