import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Share,
  Text,
} from "react-native";
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
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const limit = 10;
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { users, posts, comments } = await fetchAllData(setLoading);
        const processedPosts = processData(users, posts, comments);
        setAllPosts(processedPosts);
        setPosts(processedPosts.slice(0, limit));
      } catch (error) {
        Alert.alert("Error", "Failed to load posts. Please try again.");
      }
    };
    loadData();
  }, []);

  const loadMorePosts = () => {
    if (loadingMore || posts.length >= allPosts.length) return;

    setLoadingMore(true);
    setTimeout(() => {
      setPosts((prevPosts) => [
        ...prevPosts,
        ...allPosts.slice(prevPosts.length, prevPosts.length + limit),
      ]);
      setPage((prevPage) => prevPage + 1);
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
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" />
                <Text style={styles.loadingText}>Loading more...</Text>
              </View>
            ) : null
          }
          initialNumToRender={10}
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
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
