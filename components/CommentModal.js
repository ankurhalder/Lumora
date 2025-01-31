import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";
import { fetchUserById } from "../functions/fetchUserById";

const CommentModal = ({ visible, comments, closeModal, postId }) => {
  const [newComment, setNewComment] = useState("");
  const [commentsWithUserData, setCommentsWithUserData] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const updatedComments = await Promise.all(
          comments.map(async (comment) => {
            const user = await fetchUserById(comment.user.id).catch(() => null);
            return {
              ...comment,
              user: user || { firstName: "Unknown", lastName: "", image: "" },
            };
          })
        );
        setCommentsWithUserData(updatedComments);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (visible) {
      fetchUserImages();
    }
  }, [visible, comments]);

  const handleNewComment = (commentText) => {
    alert(` Comment: "${commentText}" added to Post`);
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      handleNewComment(newComment);
      setNewComment("");
    } else {
      alert("Please enter a comment.");
    }
  };
  const handleUserPress = (userData) => {
    navigation.navigate("ProfileDetail", { userData });
  };
  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => handleUserPress(item.user)}>
          <Image
            source={{
              uri:
                item.user.image || "https://www.ankurhalder.in/apple-icon.png",
            }}
            style={styles.userImage}
          />
          <Text style={styles.commentUser}>
            {item?.user?.firstName +
              " " +
              (item?.user?.maidenName ? item?.user?.maidenName + " " : "") +
              item?.user?.lastName || "Unknown"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.commentTime}>
          {moment(item.createdAt).fromNow()}
        </Text>
      </View>
      <Text style={styles.commentText}>{item.body}</Text>

      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="thumbs-up" size={16} color="gray" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="reply" size={16} color="gray" />
          <Text style={styles.actionText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Comments</Text>

        <FlatList
          data={commentsWithUserData}
          keyExtractor={(comment) => comment.id.toString()}
          renderItem={renderComment}
        />

        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={styles.postButton}
            onPress={handlePostComment}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
    color: "gray",
    marginLeft: 10,
  },
  commentText: {
    fontSize: 14,
    marginTop: 5,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "gray",
  },
  addCommentContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
    fontSize: 14,
  },
  postButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
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

export default CommentModal;
