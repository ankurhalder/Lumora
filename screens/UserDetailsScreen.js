import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

import userData from "../data/userData";
import posts from "../data/posts";
import ProfileHeader from "../components/ProfileHeader";
import UserPostItem from "../components/UserPostItem";

const UserDetailsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (!Array.isArray(posts)) {
      console.error("posts is not an array!", posts);
      setLoading(false);
      return;
    }

    const loadPosts = () => {
      setTimeout(() => {
        setUserPosts(posts);
        setLoading(false);
      }, 500);
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem("profileImage");
        if (storedImage) {
          setProfileImage(storedImage);
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    };
    loadProfileImage();
  }, []);

  const storeNotificationRecord = async (notificationRecord) => {
    try {
      const storedRecords = await AsyncStorage.getItem("notifications");
      const notificationsArray = storedRecords ? JSON.parse(storedRecords) : [];
      notificationsArray.push(notificationRecord);
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(notificationsArray)
      );
    } catch (error) {
      console.error("Error storing notification:", error);
    }
  };

  const updateProfileImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem("profileImage", imageUri);
      setProfileImage(imageUri);

      const now = new Date();
      const notificationTime = now.toLocaleTimeString();

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Profile Image Updated",
          body: `Your image was updated at ${notificationTime}`,
        },
        trigger: null,
      });

      const notificationRecord = {
        id: now.getTime(),
        message: `Your image was updated at ${notificationTime}`,
        time: now.toISOString(),
      };
      storeNotificationRecord(notificationRecord);
    } catch (error) {
      console.error("Error saving profile image:", error);
    }
  };

  const handleLike = useCallback((postId) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, reactions: { likes: post.reactions.likes + 1 } }
          : post
      )
    );
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setUserPosts(posts);
      setRefreshing(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <FlatList
      data={userPosts}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigation.goBack}
          >
            <Icon name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <ProfileHeader
            user={userData}
            profileImage={profileImage}
            updateProfileImage={updateProfileImage}
          />
        </>
      }
      renderItem={({ item }) => (
        <UserPostItem item={item} onLike={handleLike} />
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: { padding: 10 },
});

export default UserDetailsScreen;
