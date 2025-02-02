import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";
import { fetchUserById } from "../functions/fetchUserById";
import { useThemeColors } from "../theme/ThemeProvider";
import SkeletonLoaderForComment from "./SkeletonLoaderForComment";

const CommentModal = ({ visible, comments, closeModal, postId }) => {
  const [newComment, setNewComment] = useState("");
  const [commentsWithUserData, setCommentsWithUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { background, text, secondary, borderInputField, primary } =
    useThemeColors();

  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    if (visible) {
      pan.setValue({ x: 0, y: 0 });
    }
  }, [visible, pan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        pan.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(pan, {
            toValue: { x: 0, y: 300 },
            duration: 150,
            useNativeDriver: true,
          }).start(() => closeModal());
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    if (visible) {
      fetchUserImages();
    }
  }, [visible, comments, postId]);

  const handleNewComment = (commentText) => {
    alert(`Comment: "${commentText}" added to Post`);
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      handleNewComment(newComment);
      setNewComment("");
    } else {
      alert("Please enter a comment.");
    }
  };

  const handleUserPress = (user) => {
    if (!user || !user.id) {
      console.error("Invalid user data:", user);
      return;
    }
    closeModal();
    setTimeout(() => {
      navigation.navigate("ProfileDetail", { userData: user });
    }, 300);
  };

  const handleClose = () => {
    closeModal();
  };

  const renderComment = ({ item }) => (
    <View style={[styles.commentItem, { backgroundColor: secondary }]}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => handleUserPress(item.user)}>
          <Image
            source={{
              uri:
                item.user.image || "https://www.ankurhalder.in/apple-icon.png",
            }}
            style={styles.userImage}
            onError={() => console.log("Error loading user image")}
          />
          <Text style={[styles.commentUser, { color: text }]}>
            {item?.user?.firstName +
              " " +
              (item?.user?.maidenName ? item?.user?.maidenName + " " : "") +
              item?.user?.lastName || "Unknown"}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.commentTime, { color: text }]}>
          {moment(item.createdAt).fromNow()}
        </Text>
      </View>
      <Text style={[styles.commentText, { color: text }]}>{item.body}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="thumbs-up" size={16} color={text} />
          <Text style={[styles.actionText, { color: text }]}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="reply" size={16} color={text} />
          <Text style={[styles.actionText, { color: text }]}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: background,
              transform: pan.getTranslateTransform(),
            },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.dragHandle}>
            <Text style={[styles.modalTitle, { color: text }]}>Comments</Text>
          </View>

          {loading ? (
            <SkeletonLoaderForComment count={4} />
          ) : commentsWithUserData.length === 0 ? (
            <Text style={[styles.noCommentsText, { color: text }]}>
              No Comments Yet
            </Text>
          ) : (
            <FlatList
              data={commentsWithUserData}
              keyExtractor={(comment) => comment.id.toString()}
              renderItem={renderComment}
            />
          )}

          <View style={styles.addCommentContainer}>
            <TextInput
              style={[
                styles.commentInput,
                { borderColor: borderInputField, color: text },
              ]}
              placeholder="Write a comment..."
              placeholderTextColor={text}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[styles.postButton, { backgroundColor: primary }]}
              onPress={handlePostComment}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  dragHandle: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  noCommentsText: {
    alignSelf: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  commentItem: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    marginHorizontal: 10,
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
  },
  addCommentContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
    fontSize: 14,
  },
  postButton: {
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
