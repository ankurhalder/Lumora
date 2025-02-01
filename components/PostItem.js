import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColors } from "../theme/ThemeProvider";

const PostItem = ({
  item,
  handleLike,
  openComments,
  handleShare,
  handleImagePress,
}) => {
  const [liked, setLiked] = useState(false);
  const { primary, secondary, text, icon, inactiveTab } = useThemeColors();

  const onLikePress = async () => {
    try {
      await handleLike(item.id, liked ? -1 : 1);
      setLiked(!liked);
    } catch (error) {
      Alert.alert("Error", "There was an issue liking the post.");
    }
  };

  const handleCommentPress = () => {
    try {
      openComments(item.comments);
    } catch (error) {
      Alert.alert("Error", "There was an issue opening the comments.");
    }
  };

  const handleSharePress = () => {
    try {
      handleShare(item.id);
    } catch (error) {
      Alert.alert("Error", "There was an issue sharing the post.");
    }
  };

  return (
    <View style={[styles.postContainer, { backgroundColor: secondary }]}>
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert("Saved", "Post has been saved.")}
        >
          <FontAwesome name="bookmark" size={20} color={primary} />
          <Text style={[styles.actionText, { color: text }]}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert("Reported", "Post has been reported.")}
        >
          <FontAwesome name="exclamation-triangle" size={20} color={primary} />
          <Text style={[styles.actionText, { color: text }]}>Report</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => handleImagePress(item.user)}
      >
        <Image
          source={{
            uri: item.user.image || "https://www.ankurhalder.in/apple-icon.png",
          }}
          style={styles.userImage}
        />
        <Text style={[styles.username, { color: text }]}>
          {item?.user?.firstName +
            " " +
            (item?.user?.maidenName ? item?.user?.maidenName + " " : "") +
            item?.user?.lastName || "Unknown"}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.postTitle, { color: text }]}>{item.title}</Text>
      <Text style={[styles.postBody, { color: inactiveTab }]}>{item.body}</Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
          <FontAwesome
            name="thumbs-up"
            size={20}
            color={liked ? primary : icon}
          />
          <Text style={[styles.actionText, { color: text }]}>
            {item.reactions.likes + (liked ? 1 : 0)} Likes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCommentPress}
        >
          <FontAwesome name="comment" size={20} color={primary} />
          <Text style={[styles.actionText, { color: text }]}>
            {item.comments.length} Comments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSharePress}
        >
          <FontAwesome name="share" size={20} color={primary} />
          <Text style={[styles.actionText, { color: text }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
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
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 12,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  postBody: {
    fontSize: 15,
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default PostItem;
