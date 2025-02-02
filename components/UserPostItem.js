import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const UserPostItem = ({ item, onLike }) => (
  <View style={styles.postContainer}>
    <Text style={styles.postTitle}>{item.title}</Text>
    <Text style={styles.postBody}>{item.body}</Text>
    <TouchableOpacity style={styles.likeButton} onPress={() => onLike(item.id)}>
      <Icon name="favorite" size={18} color="red" />
      <Text style={styles.likeText}>{item.reactions.likes}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  postContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  postTitle: { fontSize: 16, fontWeight: "bold" },
  postBody: { fontSize: 14, marginVertical: 5 },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  likeText: { fontSize: 14, marginLeft: 5, color: "black" },
});

export default UserPostItem;
