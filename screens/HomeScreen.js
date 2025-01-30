import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import fetchAllData from "../functions/fetchAllData";
import processData from "../functions/processData";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
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
    if (posts.length < allPosts.length) {
      const nextPosts = allPosts.slice(0, posts.length + limit);
      setPosts(nextPosts);
      setPage(page + 1);
    }
  };

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: { ...post.reactions, likes: post.reactions.likes + 1 },
            }
          : post
      )
    );
  };

  const openComments = (comments) => {
    setSelectedComments(comments);
    setModalVisible(true);
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
            <View style={styles.postContainer}>
              {/* User Info */}
              <View style={styles.userInfo}>
                <Image
                  source={{
                    uri: item.user.image || "https://via.placeholder.com/50",
                  }}
                  style={styles.userImage}
                />
                <Text style={styles.username}>{item.user.username}</Text>
              </View>

              {/* Post Content */}
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postBody}>{item.body}</Text>

              {/* Post Actions */}
              <View style={styles.actionsContainer}>
                {/* Like Button */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(item.id)}
                >
                  <FontAwesome name="thumbs-up" size={20} color="blue" />
                  <Text style={styles.actionText}>
                    {item.reactions.likes} Likes
                  </Text>
                </TouchableOpacity>

                {/* Comment Button */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openComments(item.comments)}
                >
                  <FontAwesome name="comment" size={20} color="green" />
                  <Text style={styles.actionText}>
                    {item.comments.length} Comments
                  </Text>
                </TouchableOpacity>

                {/* Share Button (Placeholder) */}
                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesome name="share" size={20} color="purple" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            posts.length < allPosts.length ? (
              <ActivityIndicator size="small" />
            ) : null
          }
        />
      )}

      {/* Comments Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Comments</Text>
          <FlatList
            data={selectedComments}
            keyExtractor={(comment) => comment.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.commentText}>
                  <Text style={styles.commentUser}>{item.user.fullName}: </Text>
                  {item.body}
                </Text>
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  postContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  postBody: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  commentItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  commentText: {
    fontSize: 14,
  },
  commentUser: {
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    alignItems: "center",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default HomeScreen;
