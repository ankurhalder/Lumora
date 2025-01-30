import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import fetchAllData from "../functions/fetchAllData";
import processData from "../functions/processData";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
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
              <View style={styles.userInfo}>
                <Image
                  source={{
                    uri: item.user.image || "https://via.placeholder.com/50",
                  }}
                  style={styles.userImage}
                />
                <Text style={styles.username}>{item.user.username}</Text>
              </View>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postBody}>{item.body}</Text>
              <Text style={styles.commentText}>
                {item.comments.length} comments
              </Text>
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
  commentText: {
    fontSize: 12,
    color: "blue",
    marginTop: 5,
  },
});

export default HomeScreen;
