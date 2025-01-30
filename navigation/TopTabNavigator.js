import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileStackNavigator from "../screens/ProfileStackNavigator";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons } from "react-native-vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Tab = createMaterialTopTabNavigator();

function TopTabNavigator() {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Lumora</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="add-outline" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="search-outline" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarStyle: {
            backgroundColor: "white",
            elevation: 10,
            shadowOpacity: 10,
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#007bff",
            height: 3,
            borderRadius: 2,
          },
          tabBarItemStyle: {
            transition: "all 0.3s ease",
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator} // Use the stack navigator here
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name="notifications-outline"
                size={size}
                color={color}
              />
            ),
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 5,
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

export default TopTabNavigator;
