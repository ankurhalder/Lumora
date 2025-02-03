import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import UpdateUserProfileImage from "./UpdateUserProfileImage";

const DEFAULT_COVER = "https://www.ankurhalder.in/apple-icon.png";
const DEFAULT_PROFILE = "https://www.ankurhalder.in/apple-icon.png";

const ProfileHeader = ({ user, profileImage, updateProfileImage }) => {
  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  return (
    <View style={styles.profileContainer}>
      <Image
        source={{
          uri: !coverError && user.coverImage ? user.coverImage : DEFAULT_COVER,
        }}
        style={styles.coverImage}
        accessible={true}
        accessibilityLabel="Cover image"
        onError={() => setCoverError(true)}
      />
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri:
              !profileError && profileImage
                ? profileImage
                : user.image || DEFAULT_PROFILE,
          }}
          style={styles.profileImage}
          accessible={true}
          accessibilityLabel="Profile image"
          onError={() => setProfileError(true)}
        />
        <UpdateUserProfileImage updateProfileImage={updateProfileImage} />
      </View>
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

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  coverImage: { width: "100%", height: 100, marginBottom: -50 },
  profileImageContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 10,
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#000", marginTop: 10 },
  username: { fontSize: 16, color: "gray", marginBottom: 10 },
  infoContainer: { alignItems: "center" },
  infoText: { fontSize: 14, marginBottom: 5, color: "#333" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#000",
  },
});

export default ProfileHeader;
