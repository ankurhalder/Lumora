import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const PostItem = ({ item, handleLike, openComments, handleShare }) => {
  const [liked, setLiked] = useState(false);

  const onLikePress = () => {
    setLiked(!liked);
    handleLike(item.id, !liked - 1);
  };

  const onSharePress = () => {
    handleShare(item.id);
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.user.image || "https://via.placeholder.com/50" }}
          style={styles.userImage}
        />
        <Text style={styles.username}>{item.user.username}</Text>
      </View>

      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
          <FontAwesome
            name="thumbs-up"
            size={20}
            color={liked ? "blue" : "gray"}
          />
          <Text style={styles.actionText}>
            {item.reactions.likes + (liked ? 1 : 0)} Likes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openComments(item.comments)}
        >
          <FontAwesome name="comment" size={20} color="green" />
          <Text style={styles.actionText}>{item.comments.length} Comments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onSharePress}>
          <FontAwesome name="share" size={20} color="purple" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default PostItem;
