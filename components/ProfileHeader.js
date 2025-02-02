import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import UpdateUserProfileImage from "./UpdateUserProfileImage";

const ProfileHeader = ({
  user,
  profileImage,
  updateProfileImage,
  theme = "light",
}) => {
  const styles = themedStyles(theme);

  return (
    <View style={styles.profileContainer}>
      <Image
        source={{
          uri: user.coverImage || "https://via.placeholder.com/300x100",
        }}
        style={styles.coverImage}
      />

      <Image
        source={{ uri: profileImage ? profileImage : user.image }}
        style={styles.profileImage}
      />
      <UpdateUserProfileImage updateProfileImage={updateProfileImage} />
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

const themedStyles = (theme) => {
  const isDark = theme === "dark";
  return StyleSheet.create({
    profileContainer: {
      alignItems: "center",
      padding: 20,
      backgroundColor: isDark ? "#333" : "#fff",
    },
    coverImage: { width: "100%", height: 100, marginBottom: -50 },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: isDark ? "#fff" : "#000",
      marginBottom: 10,
    },
    name: { fontSize: 20, fontWeight: "bold", color: isDark ? "#fff" : "#000" },
    username: { fontSize: 16, color: "gray", marginBottom: 10 },
    infoContainer: { alignItems: "center" },
    infoText: {
      fontSize: 14,
      marginBottom: 5,
      color: isDark ? "#ddd" : "#333",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 10,
      color: isDark ? "#fff" : "#000",
    },
  });
};

export default ProfileHeader;
