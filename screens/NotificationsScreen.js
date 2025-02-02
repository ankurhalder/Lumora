import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notifications");
      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);
        const sorted = parsed.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setNotifications(sorted);
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications().then(() => setRefreshing(false));
  }, []);

  const clearNotifications = useCallback(() => {
    Alert.alert(
      "Clear Notifications",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("notifications");
              setNotifications([]);
            } catch (error) {}
          },
          style: "destructive",
        },
      ]
    );
  }, []);

  const deleteNotification = async (notificationId) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const updatedNotifications = notifications.filter(
                (n) => n.id !== notificationId
              );
              await AsyncStorage.setItem(
                "notifications",
                JSON.stringify(updatedNotifications)
              );
              setNotifications(updatedNotifications);
            } catch (error) {}
          },
          style: "destructive",
        },
      ]
    );
  };

  const timeAgo = (timeString) => {
    const seconds = Math.floor((new Date() - new Date(timeString)) / 1000);
    let interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback
      onLongPress={() => deleteNotification(item.id)}
      accessibilityLabel="Notification item"
      testID={`notification-item-${item.id}`}
    >
      <View style={styles.notificationItem}>
        <Text style={styles.notificationText}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {timeAgo(item.time)} ({new Date(item.time).toLocaleString()})
        </Text>
      </View>
    </TouchableWithoutFeedback>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
