import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";

const CustomDrawerContent = ({ statusBarHeight }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: statusBarHeight }]}>
      <View style={styles.mainSection}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.itemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person" size={24} color="black" />
          <Text style={styles.itemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Ionicons name="notifications" size={24} color="black" />
          <Text style={styles.itemText}>Notifications</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.settingsSection}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings" size={24} color="black" />
          <Text style={styles.itemText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainSection: {
    flex: 1,
  },
  settingsSection: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: "auto",
  },
  item: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CustomDrawerContent;
