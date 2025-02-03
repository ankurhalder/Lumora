import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  SectionList,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notifications");
      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications).map((notif) => ({
          ...notif,
          read: notif.read || false,
        }));
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
          text: "Clear All",
          onPress: async () => {
            await AsyncStorage.removeItem("notifications");
            setNotifications([]);
          },
        },
      ]
    );
  }, []);

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      read: true,
    }));
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const toggleReadStatus = async (id) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: !notif.read } : notif
    );
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const deleteNotification = async (id) => {
    const updatedNotifications = notifications.filter(
      (notif) => notif.id !== id
    );
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const filteredNotifications = notifications.filter((notif) =>
    notif.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupNotificationsByDate = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const sections = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    filteredNotifications.forEach((notif) => {
      const notifDate = new Date(notif.time).toDateString();
      if (notifDate === today) {
        sections.Today.push(notif);
      } else if (notifDate === yesterday) {
        sections.Yesterday.push(notif);
      } else {
        sections.Earlier.push(notif);
      }
    });

    return Object.keys(sections)
      .filter((key) => sections[key].length > 0)
      .map((key) => ({ title: key, data: sections[key] }));
  };

  const addNotification = async () => {
    if (!newMessage.trim()) {
      Alert.alert("Empty Message", "Please enter a notification message.");
      return;
    }

    const newNotification = {
      id: Date.now(),
      message: newMessage,
      time: new Date().toISOString(),
      read: false,
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify(updatedNotifications)
    );
    setNewMessage("");
    setModalVisible(false);
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.read ? styles.readNotification : styles.unreadNotification,
      ]}
      onPress={() => toggleReadStatus(item.id)}
      onLongPress={() =>
        Alert.alert(
          "Delete Notification",
          "Do you want to delete this notification?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => deleteNotification(item.id) },
          ]
        )
      }
    >
      <Text style={[styles.messageText, item.read && styles.readText]}>
        {item.message}
      </Text>
      <Text style={styles.timeText}>
        {new Date(item.time).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notifications..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearNotifications}
        >
          <Icon name="delete-sweep" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.markAllContainer}>
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Mark All as Read</Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={groupNotificationsByDate()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications found.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Notification</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your notification message"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={addNotification}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 10 },
  header: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  clearButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 20,
  },
  markAllContainer: {
    alignItems: "flex-end",
    marginBottom: 5,
  },
  markAllButton: {
    backgroundColor: "#28a745",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  markAllText: {
    color: "#fff",
    fontSize: 14,
  },
  notificationItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  unreadNotification: { backgroundColor: "#e6f2ff" },
  readNotification: { backgroundColor: "#f9f9f9" },
  messageText: { fontSize: 14 },
  readText: { color: "gray" },
  timeText: { fontSize: 12, color: "gray", marginTop: 5 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "gray",
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#28a745",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default NotificationsScreen;
