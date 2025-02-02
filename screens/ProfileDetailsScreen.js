import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Alert,
  Share,
  TouchableOpacity,
  Button,
} from "react-native";

import SkeletonLoaderForProfile from "../components/SkeletonLoaderForProfile";

import fetchAllData from "../functions/fetchAllData";
import processData from "../functions/processData";
import PostItem from "../components/PostItem";
import CommentModal from "../components/CommentModal";
import { useThemeColors } from "../theme/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProfileDetailScreen = ({ route }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const [error, setError] = useState(null);

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
      <Text style={[styles.username, { color: gray }]}>
        @{userData.username}
      </Text>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert("Followed", "You are now following this user.")
          }
        >
          <Text style={styles.actionButtonText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert("Message", "You have sent a message to this user.")
          }
        >
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.infoContainer,
          { backgroundColor: "#f0f4f7", borderRadius: 10, padding: 15 },
        ]}
      >
        {renderInfoItem("mail", "#FF5722", "Email", userData.email)}
        {renderInfoItem("phone", "#4CAF50", "Phone", userData.phone)}
        {renderInfoItem("cake", "#9C27B0", "Age", userData.age)}
        {renderInfoItem("wc", "#3F51B5", "Gender", userData.gender)}
        {renderInfoItem(
          "work",
          "#FF9800",
          "Occupation",
          `${userData.company?.title} at ${userData.company?.name} (${userData.company?.department})`
        )}
        {renderInfoItem(
          "location-on",
          "#F44336",
          "Address",
          `${userData.address?.address}, ${userData.address?.city}, ${userData.address?.state}, ${userData.address?.country}`
        )}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleProfileShare}
        >
          <Text style={styles.shareButtonText}>Share Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInfoItem = (iconName, iconColor, label, value) => (
    <View style={styles.infoRow}>
      <Icon
        name={iconName}
        size={22}
        color={iconColor}
        style={styles.infoIcon}
      />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    loadData();
  };
  const handleShare = async (item) => {
    try {
      const postUrl = `https://www.ankurhalder.in/${item.id}`;
      const message = `
        Check out this post: ${postUrl}
        Title: ${item.title}
        ${item.body}
        Author: ${item.user.firstName} ${item.user.lastName} (${
        item.user.email
      })
        Likes: ${item.reactions.likes}, Dislikes: ${item.reactions.dislikes}
        Tags: ${item.tags.join(", ")}
      `;
      await Share.share({ message });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
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
        <Icon name="arrow-back" size={24} color={text} />
      </TouchableOpacity>

      {loading ? (
        <SkeletonLoaderForProfile />
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostItem
              item={item}
              handleLike={handleLike}
              openComments={openComments}
              handleShare={() => handleShare(item)}
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
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  username: {
    fontSize: 18,
    color: "#888",
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    marginTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  infoValue: {
    fontSize: 16,
    color: "#555",
    marginTop: 2,
  },
  backButton: {
    padding: 10,
    marginBottom: 15,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
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
