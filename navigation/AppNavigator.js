import React, { memo } from "react";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "react-native-vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileDetailScreen from "../screens/ProfileDetailsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";

export const navigationRef = createNavigationContainerRef();

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const ProfileStack = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
  </Stack.Navigator>
));

const CustomHeader = memo(() => (
  <SafeAreaView style={styles.headerContainer}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Lumora</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity accessible accessibilityLabel="Add Post">
          <Ionicons name="add-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity accessible accessibilityLabel="Search">
          <Ionicons name="search-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
));

const MainTabs = memo(() => (
  <>
    <CustomHeader />
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={tabIcon("home-outline")}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={tabIcon("person-outline")}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={tabIcon("notifications-outline")}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={tabIcon("settings-outline")}
      />
    </Tab.Navigator>
  </>
));

const RootNavigator = () => (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const tabScreenOptions = {
  tabBarActiveTintColor: "#007bff",
  tabBarInactiveTintColor: "gray",
  tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
  tabBarStyle: { backgroundColor: "white", elevation: 5 },
  tabBarIndicatorStyle: {
    backgroundColor: "#007bff",
    height: 3,
    borderRadius: 2,
  },
};

const tabIcon = (name) => ({
  tabBarIcon: ({ color, size }) => (
    <Ionicons name={name} size={size} color={color} />
  ),
  tabBarLabel: () => null,
});

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "white",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerText: {
    color: "#007bff",
    fontSize: 24,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default RootNavigator;
