import React, { useState, useEffect, useCallback } from "react";
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
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const navigation = useNavigation();
  const {
    background,
    text,
    gray,
    accentPurple,
    borderInputField,
    shadowLight,
  } = useThemeColors();
  const { userData } = route.params || {};

  useEffect(() => {
    if (!userData) return;
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

  const handleLike = useCallback((postId, liked) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                likes: liked
                  ? post.reactions.likes - 1
                  : post.reactions.likes + 1,
              },
            }
          : post
      )
    );
  }, []);

  const openComments = useCallback((comments) => {
    setSelectedComments(comments);
    setModalVisible(true);
  }, []);

  const handleShare = (postId) => {
    const postUrl = `https://www.ankurhalder.in/${postId}`;
    Share.share({
      message: `Check out this post: ${postUrl}`,
    }).catch((error) => Alert.alert(error.message));
  };

  const handleImagePress = (userData) => {
    if (userData.id !== route.params?.userData?.id) {
      navigation.navigate("ProfileDetail", { userData });
    }
  };

  const renderProfileHeader = () => (
    <View style={[styles.profileContainer, { backgroundColor: background }]}>
      <Image
        source={{
          uri: userData.image || "https://www.ankurhalder.in/apple-icon.png",
        }}
        style={styles.profileImage}
      />
      <Text style={[styles.name, { color: text }]}>
        {`${userData.firstName} ${userData.maidenName || ""} ${
          userData.lastName
        }`}
      </Text>
      <Text style={[styles.username, { color: gray }]}>
        @{userData.username}
      </Text>
      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: text }]}>
          Email: {userData.email}
        </Text>
        <Text style={[styles.infoText, { color: text }]}>
          Phone: {userData.phone}
        </Text>
        <Text style={[styles.infoText, { color: text }]}>
          Age: {userData.age}
        </Text>
        <Text style={[styles.infoText, { color: text }]}>
          Gender: {userData.gender}
        </Text>
        <Text style={[styles.infoText, { color: text }]}>
          Occupation: {userData.company?.title} at {userData.company?.name} (
          {userData.company?.department})
        </Text>
        <Text style={[styles.infoText, { color: text }]}>
          Address: {userData.address?.address}, {userData.address?.city},{" "}
          {userData.address?.state}, {userData.address?.country}
        </Text>
      </View>
      <Text style={[styles.sectionTitle, { color: text }]}>
        Posts by {userData.firstName}
      </Text>
    </View>
  );

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: text }}>No User Data Available</Text>
      </View>
    );
  }

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
    borderWidth: 5,
    borderColor: "#ffffff",
    marginBottom: 15,
    transition: "all 0.3s ease",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  username: {
    fontSize: 20,
    // color: gray,
    marginBottom: 15,
    textAlign: "center",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 20,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  infoContainer: {
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    lineHeight: 24,
  },
});

export default ProfileDetailScreen;
