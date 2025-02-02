import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const clearNotifications = useCallback(() => {
    Alert.alert(
      "Clear Notifications",
      "Are you sure you want to clear all notifications?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("notifications");
              setNotifications([]);
            } catch (error) {
              console.error("Error clearing notifications:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <Text style={styles.notificationTime}>
        {new Date(item.time).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearNotifications}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  clearText: { fontSize: 16, color: "#007bff" },
  noNotifications: { fontSize: 16, color: "gray" },
  notificationItem: {
    padding: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  notificationText: { fontSize: 16 },
  notificationTime: { fontSize: 12, color: "gray", marginTop: 5 },
});

export default NotificationsScreen;
