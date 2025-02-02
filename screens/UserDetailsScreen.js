import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import userData from "../data/userData";
import posts from "../data/posts";

const ProfileHeader = ({ user }) => (
  <View style={styles.profileContainer}>
    <Image source={{ uri: user.image }} style={styles.profileImage} />
    <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
    <Text style={styles.username}>@{user.username}</Text>
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>Email: {user.email}</Text>
      <Text style={styles.infoText}>Phone: {user.phone}</Text>
      <Text style={styles.infoText}>Age: {user.age}</Text>
      <Text style={styles.infoText}>Gender: {user.gender}</Text>
      <Text style={styles.infoText}>
        Occupation: {user.company.title} at {user.company.name} (
        {user.company.department})
      </Text>
      <Text style={styles.infoText}>
        Address: {user.address.address}, {user.address.city},{" "}
        {user.address.state}, {user.address.country}
      </Text>
    </View>
  </View>
);

const PostItem = ({ item }) => (
  <View style={styles.postContainer}>
    <Text style={styles.postTitle}>{item.title}</Text>
    <Text style={styles.postBody}>{item.body}</Text>
  </View>
);

const UserDetailsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!Array.isArray(posts)) {
      console.error("posts is not an array!", posts);
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setUserPosts(posts);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ProfileHeader user={userData} />

      {userPosts.map((item) => (
        <PostItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileContainer: { alignItems: "center", padding: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  username: { fontSize: 16, color: "gray", marginBottom: 10 },
  infoContainer: { alignItems: "center" },
  infoText: { fontSize: 14, marginBottom: 5 },
  backButton: { padding: 10 },
  postContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  postTitle: { fontSize: 16, fontWeight: "bold" },
  postBody: { fontSize: 14, marginTop: 5 },
});

export default UserDetailsScreen;
