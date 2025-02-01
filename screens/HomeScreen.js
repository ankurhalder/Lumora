import React, { useState, useEffect } from "react";
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
import fetchAllData from "../functions/fetchAllData";
import processData from "../functions/processData";
import PostItem from "../components/PostItem";
import CommentModal from "../components/CommentModal";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const limit = 10;
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("cachedPosts");

        if (storedData) {
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

    loadData();
  }, []);

  useEffect(() => {
    const clearStorage = async () => {
      await AsyncStorage.removeItem("cachedPosts");
    };

    return clearStorage;
  }, []);

  const fetchAndCacheData = async () => {
    setLoading(true);
    try {
      const { users, posts, comments } = await fetchAllData(setLoading);
      const processedPosts = processData(users, posts, comments);

      await AsyncStorage.setItem("cachedPosts", JSON.stringify(processedPosts));

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

  const handleLike = (postId, liked) => {
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
  };

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

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostItem
              item={item}
              handleLike={handleLike}
              openComments={openComments}
              handleShare={handleShare}
              handleImagePress={handleImagePress}
            />
          )}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          getItemLayout={(data, index) => ({
            length: 120,
            offset: 120 * index,
            index,
          })}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshPosts} />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" />
                <Text style={styles.loadingText}>Loading more...</Text>
              </View>
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
  footer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingText: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
  },
});

export default HomeScreen;
