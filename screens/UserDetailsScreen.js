import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
  Share,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "../theme/ThemeProvider";

const userData = {
  id: 1,
  firstName: "Ankur",
  lastName: "Halder",
  username: "ankurhalder",
  email: "ankur.halder12345@gmail.com",
  phone: "+919748903490",
  age: 30,
  gender: "Male",
  company: {
    title: "Software Engineer",
    name: "Tech Corp",
    department: "Development",
  },
  address: {
    address: "123, Tech Street",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
  },
  image: "https://www.ankurhalder.in/apple-icon.png",
};

const posts = [
  {
    id: 1,
    title: "My First Post",
    body: "This is the first post I made. Just testing out the app!",
    reactions: { likes: 12 },
  },
  {
    id: 2,
    title: "Learning React Native",
    body: "React Native is such a powerful framework. Loving the development experience!",
    reactions: { likes: 22 },
  },
];

const ProfileHeader = ({ user, colors }) => {
  const { background, text, gray } = colors;
  return (
    <View style={[styles.profileContainer, { backgroundColor: background }]}>
      <Image source={{ uri: user.image }} style={styles.profileImage} />
      <Text
        style={[styles.name, { color: text }]}
      >{`${user.firstName} ${user.lastName}`}</Text>
      <Text style={[styles.username, { color: gray }]}>@{user.username}</Text>
      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: text }]}>
          Email: {user.email}
        </Text>
        <Text style={[styles.infoText, { color: text }]}>
          Phone: {user.phone}
        </Text>
        <Text style={[styles.infoText, { color: text }]}>Age: {user.age}</Text>
        <Text style={[styles.infoText, { color: text }]}>
          Gender: {user.gender}
        </Text>
        <Text style={[styles.infoText, { color: text }]}>
          Occupation: {user.company.title} at {user.company.name} (
          {user.company.department})
        </Text>
        <Text style={[styles.infoText, { color: text }]}>
          Address: {user.address.address}, {user.address.city},{" "}
          {user.address.state}, {user.address.country}
        </Text>
      </View>
    </View>
  );
};

const PostItem = ({ item, onLike, onShare }) => (
  <View style={styles.postContainer}>
    <Text style={styles.postTitle}>{item.title}</Text>
    <Text style={styles.postBody}>{item.body}</Text>
    <View style={styles.postActions}>
      <TouchableOpacity onPress={() => onLike(item.id)}>
        <Text style={styles.postActionText}>Like ({item.reactions.likes})</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          Alert.alert("Comment", "This is where comments would be.")
        }
      >
        <Text style={styles.postActionText}>Comment</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onShare(item.id)}>
        <Text style={styles.postActionText}>Share</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const UserDetailsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation();
  const colors = useThemeColors();

  useEffect(() => {
    setLoading(false);
    setUserPosts(posts);
  }, []);

  const handleLike = (postId) => {
    setUserPosts((prevPosts) =>
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

  const handleShare = (postId) => {
    const postUrl = `https://www.ankurhalder.in/${postId}`;
    Share.share({ message: `Check out this post: ${postUrl}` }).catch((error) =>
      Alert.alert(error.message)
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <Icon name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <ProfileHeader user={userData} colors={colors} />

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert("Followed", "You are now following yourself.")
          }
        >
          <Text style={styles.actionButtonText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert("Message", "You have sent a message to yourself.")
          }
        >
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare(userData.id)}
        >
          <Text style={styles.actionButtonText}>Share Profile</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostItem item={item} onLike={handleLike} onShare={handleShare} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileContainer: {
    alignItems: "center",
    padding: 25,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 15,
  },
  name: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  username: { fontSize: 18, color: "#888", marginBottom: 10 },
  infoContainer: { marginVertical: 15, alignItems: "flex-start" },
  infoText: { fontSize: 16 },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  actionButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
  },
  actionButtonText: { color: "#fff", fontSize: 16 },
  backButton: { padding: 10, marginBottom: 15 },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  postTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  postBody: { fontSize: 16, marginBottom: 10 },
  postActions: { flexDirection: "row", justifyContent: "space-between" },
  postActionText: { fontSize: 16, color: "#007bff" },
});

export default UserDetailsScreen;
