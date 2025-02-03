import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "../theme/ThemeProvider";

const UserPostItem = ({
  item,
  onLike,
  onComment,
  onShare,
  onBookmark,
  bookmarked,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const themeColors = useThemeColors();

  const handleLikePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    Haptics.selectionAsync();
    onLike(item.id);
  };

  return (
    <View
      style={[
        styles.postContainer,
        {
          backgroundColor: themeColors.secondary,
          borderColor: themeColors.cardOutline,
        },
      ]}
    >
      <Text style={[styles.postTitle, { color: themeColors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.postBody, { color: themeColors.text }]}>
        {item.body}
      </Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLikePress}
          accessibilityLabel="Like post"
          testID={`like-button-${item.id}`}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Icon name="favorite" size={18} color={themeColors.error} />
          </Animated.View>
          <Text style={[styles.actionText, { color: themeColors.text }]}>
            {item.reactions.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment && onComment(item)}
          accessibilityLabel="Comment on post"
          testID={`comment-button-${item.id}`}
        >
          <Icon name="comment" size={18} color={themeColors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare && onShare(item)}
          accessibilityLabel="Share post"
          testID={`share-button-${item.id}`}
        >
          <Icon name="share" size={18} color={themeColors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onBookmark(item.id)}
          accessibilityLabel="Bookmark post"
          testID={`bookmark-button-${item.id}`}
        >
          <Icon
            name={bookmarked ? "bookmark" : "bookmark-border"}
            size={18}
            color={themeColors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postBody: {
    fontSize: 14,
    marginVertical: 5,
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
    fontSize: 14,
    marginLeft: 5,
  },
});

export default React.memo(UserPostItem);
