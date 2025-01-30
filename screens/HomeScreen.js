import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Share,
} from "react-native";
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

  useEffect(() => {
    const loadData = async () => {
      const { users, posts, comments } = await fetchAllData(setLoading);
      const processedPosts = processData(users, posts, comments);
      setAllPosts(processedPosts);
      setPosts(processedPosts.slice(0, limit));
    };
    loadData();
  }, []);

  const loadMorePosts = () => {
    if (loadingMore || posts.length >= allPosts.length) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextPosts = allPosts.slice(0, posts.length + limit);
      setPosts(nextPosts);
      setPage(page + 1);
      setLoadingMore(false);
    }, 1000);
  };

  const handleLike = (postId, liked) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedLikes = liked
            ? post.reactions.likes + 0
            : post.reactions.likes - 0;

          return {
            ...post,
            reactions: {
              ...post.reactions,
              likes: updatedLikes,
            },
          };
        }
        return post;
      })
    );
  };

  const openComments = (comments) => {
    setSelectedComments(comments);
    setModalVisible(true);
  };

  const handleShare = (postId) => {
    const postUrl = `https://www.ankurhalder.in/${postId}`;

    Share.share({
      message: `Check out this post: ${postUrl}`,
    }).catch((error) => Alert.alert(error.message));
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
            />
          )}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" /> : null
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
});

export default HomeScreen;
