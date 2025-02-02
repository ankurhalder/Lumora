import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Share,
  Text,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import fetchAllData from "../functions/fetchAllData";
import processData from "../functions/processData";
import PostItem from "../components/PostItem";
import CommentModal from "../components/CommentModal";
import SkeletonLoader from "../components/SkeletonLoader";
import debounce from "lodash.debounce";
import { useThemeColors } from "../theme/ThemeProvider";

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
  const colors = useThemeColors();

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    loadData();
    return unsubscribe;
  }, []);

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

      await AsyncStorage.multiSet([
        ["cachedPosts", JSON.stringify(processedPosts)],
        ["lastUpdated", Date.now().toString()],
      ]);

      setAllPosts(processedPosts);
      setPosts(processedPosts.slice(0, limit));
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to refresh posts. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    setRefreshing(true);
    await AsyncStorage.multiRemove(["cachedPosts", "lastUpdated"]);
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
    debounce((postId, delta) => {
      setPosts((prevPosts) => {
        const index = prevPosts.findIndex((post) => post.id === postId);
        if (index === -1) return prevPosts;

        const updatedPosts = [...prevPosts];
        updatedPosts[index] = {
          ...updatedPosts[index],
          reactions: {
            ...updatedPosts[index].reactions,
            likes: updatedPosts[index].reactions.likes + delta,
          },
        };

        return updatedPosts;
      });
    }, 300),
    [setPosts]
  );

  const openComments = (comments) => {
    setSelectedComments(comments);
    setModalVisible(true);
  };

  const handleShare = async (item) => {
    try {
      const postUrl = `https://www.ankurhalder.in/${item.id}`;
      const message = `
        Check out this post: ${postUrl}
        Title: ${item.title}
        ${item.body}
        Author: ${item.user.firstName} ${item.user.lastName} (${
        item.user.email
      })
        Likes: ${item.reactions.likes}, Dislikes: ${item.reactions.dislikes}
        Tags: ${item.tags.join(", ")}
      `;
      await Share.share({ message });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <PostItem
        item={item}
        handleLike={handleLike}
        openComments={openComments}
        handleShare={() =>
          handleShare(posts.find((post) => post.id === item.id))
        }
      />
    ),
    [handleLike, openComments, handleShare]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isOffline && (
        <Text style={[styles.offlineMessage, { color: colors.error }]}>
          You are offline
        </Text>
      )}

      {loading ? (
        <SkeletonLoader count={5} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.1}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          windowSize={7}
          viewabilityConfig={viewabilityConfig.current}
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
  },
  offlineMessage: {
    textAlign: "center",
    padding: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
});

export default HomeScreen;
