import React, { memo, useState } from "react";
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
  Modal,
  TextInput,
  Pressable,
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
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
  </Stack.Navigator>
));

const CustomHeader = memo(({ onSearchPress, onAddPress }) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Lumora</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={onAddPress}
            accessible
            accessibilityLabel="Add Post"
            style={styles.iconButton}
          >
            <Ionicons name="add-outline" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSearchPress}
            accessible
            accessibilityLabel="Search"
            style={styles.iconButton}
          >
            <Ionicons name="search-outline" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
});

const SearchModal = memo(({ visible, onClose }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TextInput
          placeholder="Search..."
          style={styles.searchInput}
          autoFocus
        />
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-outline" size={28} color="black" />
        </Pressable>
      </View>
    </View>
  </Modal>
));

const tabIcon = (name) => ({
  tabBarIcon: ({ color, size }) => (
    <Ionicons name={name} size={size} color={color} />
  ),
  tabBarLabel: () => null,
});

const MainTabs = memo(() => {
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <>
      <CustomHeader
        onSearchPress={() => setSearchVisible(true)}
        onAddPress={() => alert("Add Post clicked")}
      />
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />
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
  );
});

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
  iconButton: {
    marginLeft: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
});

export default RootNavigator;
