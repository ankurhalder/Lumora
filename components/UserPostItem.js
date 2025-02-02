import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

const UserPostItem = ({ item, onLike, onComment, onShare }) => {
  const handleLikePress = () => {
    Haptics.selectionAsync();
    onLike(item.id);
  };
  return (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLikePress}
          accessibilityLabel="Like post"
          testID={`like-button-${item.id}`}
        >
          <Icon name="favorite" size={18} color="red" />
          <Text style={styles.actionText}>{item.reactions.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment && onComment(item)}
          accessibilityLabel="Comment on post"
          testID={`comment-button-${item.id}`}
        >
          <Icon name="comment" size={18} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare && onShare(item)}
          accessibilityLabel="Share post"
          testID={`share-button-${item.id}`}
        >
          <Icon name="share" size={18} color="#007bff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  postTitle: { fontSize: 16, fontWeight: "bold" },
  postBody: { fontSize: 14, marginVertical: 5 },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionButton: { flexDirection: "row", alignItems: "center" },
  actionText: { fontSize: 14, marginLeft: 5, color: "black" },
});

export default React.memo(UserPostItem);
