import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Share,
  Text,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import fetchAllData from "../functions/fetchAllData";
import processData from "../functions/processData";
import PostItem from "../components/PostItem";
import CommentModal from "../components/CommentModal";
import SkeletonLoader from "../components/SkeletonLoader";
import debounce from "lodash.debounce";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const limit = 10;
  const navigation = useNavigation();

  useEffect(() => {
    checkNetworkStatus();
    loadData();
  }, []);

  const checkNetworkStatus = async () => {
    NetInfo.fetch().then((state) => {
      setIsOffline(!state.isConnected);
    });
  };

  const loadData = async () => {
    try {
      const lastUpdated = await AsyncStorage.getItem("lastUpdated");
      const storedData = await AsyncStorage.getItem("cachedPosts");

      if (
        storedData &&
        lastUpdated &&
        Date.now() - parseInt(lastUpdated) < 10 * 60 * 1000
      ) {
        const parsedData = JSON.parse(storedData);
        setAllPosts(parsedData);
        setPosts(parsedData.slice(0, limit));
        setLoading(false);
      } else {
        await fetchAndCacheData();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load posts. Please try again.");
      setLoading(false);
    }
  };

  const fetchAndCacheData = async () => {
    setLoading(true);
    try {
      const { users, posts, comments } = await fetchAllData(setLoading);
      const processedPosts = processData(users, posts, comments);

      await AsyncStorage.setItem("cachedPosts", JSON.stringify(processedPosts));
      await AsyncStorage.setItem("lastUpdated", Date.now().toString());

      setAllPosts(processedPosts);
      setPosts(processedPosts.slice(0, limit));
    } catch (error) {
      Alert.alert("Error", "Failed to refresh posts.");
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    setRefreshing(true);
    await AsyncStorage.removeItem("cachedPosts");
    await AsyncStorage.removeItem("lastUpdated");
    await fetchAndCacheData();
    setRefreshing(false);
  };

  const loadMorePosts = () => {
    if (loadingMore || posts.length >= allPosts.length) return;

    setLoadingMore(true);
    setTimeout(() => {
      setPosts((prevPosts) => [
        ...prevPosts,
        ...allPosts.slice(prevPosts.length, prevPosts.length + limit),
      ]);
      setLoadingMore(false);
    }, 1000);
  };

  const handleLike = useCallback(
    debounce((postId, liked) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                reactions: {
                  ...post.reactions,
                  likes: liked
                    ? post.reactions.likes + 1
                    : post.reactions.likes - 1,
                },
              }
            : post
        )
      );
    }, 300),
    []
  );

  const openComments = (comments) => {
    setSelectedComments(comments);
    setModalVisible(true);
  };

  const handleShare = async (postId) => {
    try {
      const postUrl = `https://www.ankurhalder.in/${postId}`;
      await Share.share({ message: `Check out this post: ${postUrl}` });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleImagePress = (userData) => {
    navigation.navigate("ProfileDetail", { userData });
  };

  const renderItem = useCallback(
    ({ item }) => (
      <PostItem
        item={item}
        handleLike={handleLike}
        openComments={openComments}
        handleShare={handleShare}
        handleImagePress={handleImagePress}
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
      {isOffline && <Text style={styles.offlineMessage}>You are offline</Text>}

      {loading ? (
        <SkeletonLoader count={5} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          initialNumToRender={8}
          windowSize={5}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshPosts} />
          }
          ListFooterComponent={
            loadingMore ? (
              <SkeletonLoader count={2} style={{ marginBottom: 10 }} />
            ) : null
          }
        />
      )}

      <CommentModal
        visible={modalVisible}
        comments={selectedComments}
        closeModal={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  offlineMessage: {
    textAlign: "center",
    color: "red",
    padding: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
});

export default HomeScreen;
