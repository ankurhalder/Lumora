import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import userData from "../data/userData";
import posts from "../data/posts";

const ProfileHeader = ({ user, profileImage, updateProfileImage }) => {
  const handleImageUpdate = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickImage = async (mode) => {
    try {
      let result;
      if (mode === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Camera permission is required!");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 1,
        });
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Media library permission is required!"
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 1,
        });
      }

      if (result.canceled) {
        return;
      }

      const imageUri = result.assets[0].uri;
      updateProfileImage(imageUri);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Error",
        "There was an error picking the image. Please try again."
      );
    }
  };

  return (
    <View style={styles.profileContainer}>
      <Image
        source={{ uri: profileImage ? profileImage : user.image }}
        style={styles.profileImage}
      />
      <TouchableOpacity onPress={handleImageUpdate}>
        <Text style={styles.updateText}>Update Profile Image</Text>
      </TouchableOpacity>
      <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
      <Text style={styles.username}>@{user.username}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>📧 {user.email}</Text>
        <Text style={styles.infoText}>📞 {user.phone}</Text>
        <Text style={styles.infoText}>🎂 Age: {user.age}</Text>
        <Text style={styles.infoText}>⚧ Gender: {user.gender}</Text>

        <Text style={styles.sectionTitle}>🏢 Work</Text>
        <Text style={styles.infoText}>
          {user.company.title} at {user.company.name} ({user.company.department}
          )
        </Text>

        <Text style={styles.sectionTitle}>📍 Address</Text>
        <Text style={styles.infoText}>
          {user.address.address}, {user.address.city}, {user.address.state},{" "}
          {user.address.country}
        </Text>
      </View>
    </View>
  );
};

const PostItem = ({ item, onLike }) => (
  <View style={styles.postContainer}>
    <Text style={styles.postTitle}>{item.title}</Text>
    <Text style={styles.postBody}>{item.body}</Text>
    <TouchableOpacity style={styles.likeButton} onPress={() => onLike(item.id)}>
      <Icon name="favorite" size={18} color="red" />
      <Text style={styles.likeText}>{item.reactions.likes}</Text>
    </TouchableOpacity>
  </View>
);

const UserDetailsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
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

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem("profileImage");
        if (storedImage) {
          setProfileImage(storedImage);
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    };
    loadProfileImage();
  }, []);

  const updateProfileImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem("profileImage", imageUri);
      setProfileImage(imageUri);
    } catch (error) {
      console.error("Error saving profile image:", error);
    }
  };

  const handleLike = (postId) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, reactions: { likes: post.reactions.likes + 1 } }
          : post
      )
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
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ProfileHeader
        user={userData}
        profileImage={profileImage}
        updateProfileImage={updateProfileImage}
      />

      {userPosts.map((item) => (
        <PostItem key={item.id} item={item} onLike={handleLike} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileContainer: { alignItems: "center", padding: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  updateText: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  name: { fontSize: 20, fontWeight: "bold" },
  username: { fontSize: 16, color: "gray", marginBottom: 10 },
  infoContainer: { alignItems: "center" },
  infoText: { fontSize: 14, marginBottom: 5 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  backButton: { padding: 10 },
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

export default UserDetailsScreen;
