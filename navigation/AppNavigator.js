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
  useColorScheme,
} from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileDetailScreen from "../screens/ProfileDetailsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useThemeColors } from "../theme/ThemeProvider.js";

export const navigationRef = createNavigationContainerRef();

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const ProfileStack = memo(() => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animationEnabled: true }}
  >
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
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
            <Ionicons name="add-outline" size={28} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
            <Ionicons name="search-outline" size={28} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
});

const SearchModal = memo(({ visible, onClose }) => {
  const colors = useThemeColors();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={[styles.modalContainer, { backgroundColor: colors.overlay }]}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.modalBackground },
          ]}
        >
          <TextInput
            placeholder="Search..."
            style={[styles.searchInput, { color: colors.text }]}
            autoFocus
          />
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-outline" size={28} color={colors.icon} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
});

const tabIcon = (name) => ({
  tabBarIcon: ({ color, size }) => (
    <Ionicons name={name} size={size} color={color} />
  ),
  tabBarLabel: () => null,
});

const MainTabs = memo(() => {
  const [searchVisible, setSearchVisible] = useState(false);
  const colors = useThemeColors();

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
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.inactiveTab,
          tabBarStyle: { backgroundColor: colors.background, elevation: 5 },
          tabBarIndicatorStyle: {
            backgroundColor: colors.text,
            height: 3,
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
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "white",
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerText: {
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
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
