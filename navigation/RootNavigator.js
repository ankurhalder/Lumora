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
  SafeAreaView,
  StyleSheet,
} from "react-native";
import HomeScreen from "../screens/HomeScreen.js";
import ProfileScreen from "../screens/ProfileScreen.js";
import ProfileDetailScreen from "../screens/ProfileDetailsScreen.js";
import NotificationsScreen from "../screens/NotificationsScreen.js";
import SettingsScreen from "../screens/SettingsScreen.js";
import { useThemeColors } from "../theme/ThemeProvider.js";

export const navigationRef = createNavigationContainerRef();

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const ProfileStack = memo(() => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animationEnabled: true }}
  >
    <Stack.Screen
      name="ProfileHome"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProfileDetail"
      component={ProfileDetailScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
));

const CustomHeader = memo(({ onSearchPress, onAddPress }) => {
  const colors = useThemeColors();

  return (
    <SafeAreaView
      style={[styles.headerContainer, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerText, { color: colors.text }]}>Lumora</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={onAddPress} style={styles.iconButton}>
            <Ionicons name="add-outline" size={25} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
            <Ionicons name="search-outline" size={25} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
});

const tabIcon = (name) => ({
  tabBarIcon: ({ color, size }) => (
    <Ionicons name={name} size={size} color={color} />
  ),
  tabBarLabel: () => null,
});

const MainTabs = memo(() => {
  const colors = useThemeColors();

  const handleSearchPress = () => {
    alert("Search icon clicked!");
  };

  return (
    <>
      <CustomHeader
        onSearchPress={handleSearchPress}
        onAddPress={() => alert("Add Post clicked")}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.inactiveTab,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.cardOutline,
            shadowColor: colors.shadowMedium,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 4,
            borderRadius: 2,
          },
        }}
      >
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
  );
});

const RootNavigator = () => (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainTabsScreen"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "white",
  },
  header: {
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 400,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 20,
  },
});

export default RootNavigator;
