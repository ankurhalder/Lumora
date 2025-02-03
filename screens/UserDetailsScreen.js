import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
  Text,
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
import { useThemeColors } from "../theme/ThemeProvider";

const PAGE_SIZE = 5;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const UserDetailsScreen = () => {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(true);
  const [postsError, setPostsError] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const loadMoreTimeout = useRef(null);

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
    loadBookmarkedPosts();
  }, []);

  const loadBookmarkedPosts = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem("bookmarkedPosts");
      if (storedBookmarks) setBookmarkedPosts(JSON.parse(storedBookmarks));
    } catch (error) {}
  };

  const saveBookmarkedPosts = async (newBookmarks) => {
    try {
      await AsyncStorage.setItem(
        "bookmarkedPosts",
        JSON.stringify(newBookmarks)
      );
    } catch (error) {
      console.error("Error saving bookmarks", error);
    }
  };

  const toggleBookmark = (postId) => {
    const updatedBookmarks = bookmarkedPosts.includes(postId)
      ? bookmarkedPosts.filter((id) => id !== postId)
      : [...bookmarkedPosts, postId];
    setBookmarkedPosts(updatedBookmarks);
    saveBookmarkedPosts(updatedBookmarks);
  };

  const loadProfileImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem("profileImage");
      if (storedImage) setProfileImage(storedImage);
    } catch (error) {
      console.error("Error loading profile image", error);
    }
  };

  useEffect(() => {
    loadProfileImage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfileImage();
    }, [])
  );

  const visiblePosts = useMemo(
    () => userPosts.slice(0, page * PAGE_SIZE),
    [userPosts, page]
  );

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
      console.error("Error storing notification record", error);
    }
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
      if (loadMoreTimeout.current) return;
      setLoadingMore(true);
      loadMoreTimeout.current = setTimeout(() => {
        setPage((prev) => prev + 1);
        setLoadingMore(false);
        loadMoreTimeout.current = null;
      }, 500);
    }
  };

  const debouncedHandleScroll = useCallback(
    debounce((offsetY) => {
      setShowScrollToTop(offsetY > 150);
    }, 100),
    []
  );

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    debouncedHandleScroll(offsetY);
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const headerComponent = useMemo(
    () => (
      <>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigation.goBack}
            accessibilityLabel="Go Back"
            testID="back-button"
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() =>
              Alert.alert(
                "Edit Profile",
                "This will navigate to an edit profile screen."
              )
            }
            accessibilityLabel="Edit Profile"
            testID="edit-profile-button"
          >
            <Icon name="edit" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ProfileHeader
          user={userData}
          profileImage={profileImage}
          updateProfileImage={updateProfileImage}
        />
      </>
    ),
    [navigation, profileImage, updateProfileImage, colors.text]
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.center, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (postsError) {
    return (
      <SafeAreaView
        style={[styles.center, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.errorText, { color: colors.error || "red" }]}>
          Failed to load posts.
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={fetchPosts}
        >
          <Text style={[styles.retryText, { color: colors.text }]}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <AnimatedFlatList
        ref={flatListRef}
        data={visiblePosts}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={headerComponent}
        renderItem={({ item }) => (
          <Animated.View
            style={{
              opacity: scrollY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: "clamp",
              }),
            }}
          >
            <UserPostItem
              item={item}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onBookmark={toggleBookmark}
              bookmarked={bookmarkedPosts.includes(item.id)}
            />
          </Animated.View>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />
      {showScrollToTop && (
        <TouchableOpacity
          style={[styles.scrollToTop, { backgroundColor: colors.primary }]}
          onPress={scrollToTop}
          accessibilityLabel="Scroll to top"
          testID="scroll-to-top"
        >
          <Icon name="arrow-upward" size={24} color={colors.text} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  backButton: { padding: 10 },
  editProfileButton: { padding: 10 },
  scrollToTop: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  loadMoreContainer: { padding: 10, alignItems: "center" },
  errorText: { fontSize: 16, marginBottom: 10 },
  retryButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  retryText: { fontSize: 16 },
});

export default UserDetailsScreen;
