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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import fetchAllData from "../functions/fetchAllData";
import processData from "../functions/processData";
import PostItem from "../components/PostItem";
import CommentModal from "../components/CommentModal";
import { useThemeColors } from "../theme/ThemeProvider";

const ProfileDetailScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);
  const { userData } = route.params || {};
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const navigation = useNavigation();
  const { background, text, secondary } = useThemeColors();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { users, posts, comments } = await fetchAllData(setLoading);
        const processedPosts = processData(users, posts, comments);
        const filteredPosts = processedPosts.filter(
          (post) => post.userId === userData.id
        );
        setUserPosts(filteredPosts);
      } catch (error) {
        Alert.alert("Error", "Failed to load profile data.");
      }
    };
    loadData();
  }, [userData]);

  const handleLike = (postId, liked) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedLikes = liked
            ? post.reactions.likes - 1
            : post.reactions.likes + 1;

          return {
            ...post,
            reactions: {
              ...post.reactions,
              likes: updatedLikes,
            },
          };
        }
        return post;
      })
    );
  };

  const openComments = (comments) => {
    setSelectedComments(comments);
    setModalVisible(true);
  };

  const handleShare = (postId) => {
    const postUrl = `https://www.ankurhalder.in/${postId}`;
    Share.share({
      message: `Check out this post: ${postUrl}`,
    }).catch((error) => Alert.alert(error.message));
  };

  const handleImagePress = (userData) => {
    if (userData.id !== userData.id) {
      navigation.navigate("ProfileDetail", { userData });
    }
  };

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>No User Data Available</Text>
      </View>
    );
  }

  const renderProfileHeader = () => (
    <View style={[styles.profileContainer, { backgroundColor: background }]}>
      <Image
        source={{
          uri: userData.image || "https://www.ankurhalder.in/apple-icon.png",
        }}
        style={styles.profileImage}
      />
      <Text style={[styles.name, { color: text }]}>
        {`${userData.firstName} ${
          userData.maidenName ? userData.maidenName + " " : ""
        }${userData.lastName}`}
      </Text>
      <Text style={[styles.username, { color: secondary }]}>
        @{userData.username}
      </Text>
      <Text>Email: {userData.email}</Text>
      <Text>Phone: {userData.phone}</Text>
      <Text>Age: {userData.age}</Text>
      <Text>Gender: {userData.gender}</Text>
      <Text>
        Occupation: {userData.company?.title} at {userData.company?.name} (
        {userData.company?.department})
      </Text>
      <Text>
        Address: {userData.address?.address}, {userData.address?.city},{" "}
        {userData.address?.state}, {userData.address?.country}
      </Text>
      <Text style={[styles.sectionTitle, { color: text }]}>
        Posts by {userData.firstName}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostItem
              item={item}
              handleLike={handleLike}
              openComments={openComments}
              handleShare={handleShare}
              handleImagePress={handleImagePress}
            />
          )}
          ListHeaderComponent={renderProfileHeader}
        />
      )}

      <CommentModal
        visible={modalVisible}
        comments={selectedComments}
        closeModal={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileContainer: { alignItems: "center", padding: 10 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  username: { fontSize: 16, color: "gray" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
});

export default ProfileDetailScreen;
