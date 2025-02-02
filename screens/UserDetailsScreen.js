import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Share,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import userData from "../data/userData";
import posts from "../data/posts";
import ProfileHeader from "../components/ProfileHeader";
import UserPostItem from "../components/UserPostItem";

const PAGE_SIZE = 5;
const UserDetailsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [postsError, setPostsError] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchPosts = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!Array.isArray(posts)) throw new Error("Invalid posts data");
      setUserPosts(posts);
      setPostsError(false);
    } catch (error) {
      setPostsError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadProfileImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem("profileImage");
      if (storedImage) setProfileImage(storedImage);
    } catch (error) {}
  };

  useEffect(() => {
    loadProfileImage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfileImage();
    }, [])
  );

  const visiblePosts = userPosts.slice(0, page * PAGE_SIZE);

  const storeNotificationRecord = async (notificationRecord) => {
    try {
      const storedRecords = await AsyncStorage.getItem("notifications");
      const notificationsArray = storedRecords ? JSON.parse(storedRecords) : [];
      notificationsArray.push(notificationRecord);
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(notificationsArray)
      );
    } catch (error) {}
  };

  const updateProfileImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem("profileImage", imageUri);
      setProfileImage(imageUri);
      const now = new Date();
      const notificationTime = now.toLocaleTimeString();
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") await Notifications.requestPermissionsAsync();
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
      Alert.alert("Success", "Profile image updated successfully!");
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error updating your profile image. Please try again."
      );
    }
  };

  const handleLike = useCallback((postId) => {
    Haptics.selectionAsync();
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, reactions: { likes: post.reactions.likes + 1 } }
          : post
      )
    );
  }, []);

  const handleComment = useCallback((post) => {
    Alert.alert("Coming Soon", "Comment feature coming soon!");
  }, []);

  const handleShare = useCallback(async (post) => {
    try {
      const result = await Share.share({
        message: `${post.title}\n\n${post.body}`,
      });
      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      Alert.alert("Error", "There was an error sharing the post.");
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchPosts();
  }, []);

  const loadMorePosts = () => {
    if (visiblePosts.length < userPosts.length && !loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setLoadingMore(false);
      }, 500);
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 150);
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  if (postsError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Failed to load posts.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={visiblePosts}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={styles.backButton}
              onPress={navigation.goBack}
              accessibilityLabel="Go Back"
              testID="back-button"
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
          <UserPostItem
            item={item}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color="#007bff" />
            </View>
          ) : null
        }
      />
      {showScrollToTop && (
        <TouchableOpacity
          style={styles.scrollToTop}
          onPress={scrollToTop}
          accessibilityLabel="Scroll to top"
          testID="scroll-to-top"
        >
          <Icon name="arrow-upward" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: { padding: 10 },
  scrollToTop: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  loadMoreContainer: { padding: 10, alignItems: "center" },
  errorText: { fontSize: 16, color: "red", marginBottom: 10 },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: { color: "#fff", fontSize: 16 },
});

export default UserDetailsScreen;
