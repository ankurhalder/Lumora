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
  TouchableOpacity,
  Button,
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
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { background, text, gray } = useThemeColors();
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
        setError("Failed to load profile data.");
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

  const handleProfileShare = () => {
    const profileUrl = `https://www.ankurhalder.in/${userData.id}`;
    const message = `
      Check out this profile: 
      Name: ${userData.firstName} ${userData.maidenName || ""} ${
      userData.lastName
    }
      Username: @${userData.username}
      Email: ${userData.email}
      Phone: ${userData.phone}
      Age: ${userData.age}
      Gender: ${userData.gender}
      Occupation: ${userData.company?.title} at ${userData.company?.name}
      Address: ${userData.address?.address}, ${userData.address?.city}, ${
      userData.address?.state
    }, ${userData.address?.country}
      
      Profile Link: ${profileUrl}
    `;

    Share.share({
      message: message,
    }).catch((error) => Alert.alert("Share Error", error.message));
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
        defaultSource={{ uri: "https://www.ankurhalder.in/apple-icon.png" }}
      />
      <Text style={[styles.name, { color: text }]}>{`${userData.firstName} ${
        userData.maidenName || ""
      } ${userData.lastName}`}</Text>
      <Text
        style={[styles.username, { color: gray }]}
      >{`@${userData.username}`}</Text>
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

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    loadData();
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: text }}>{error}</Text>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: text }}>No User Data Available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: text }}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButton} onPress={handleProfileShare}>
        <Text style={styles.shareButtonText}>Share Profile</Text>
      </TouchableOpacity>

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
              handleShare={() => handleShare(item.id, item.title, item.body)} // Customizable message
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

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
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
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  username: {
    fontSize: 18,
    color: "#888",
    marginBottom: 10,
  },
  infoContainer: {
    marginVertical: 15,
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: "lightgrey",
    borderRadius: 5,
    marginBottom: 15,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  actionButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProfileDetailScreen;
