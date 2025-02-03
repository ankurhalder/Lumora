import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import UpdateUserProfileImage from "./UpdateUserProfileImage";
import { useThemeColors } from "../theme/ThemeProvider";

const DEFAULT_COVER = "https://www.ankurhalder.in/apple-icon.png";
const DEFAULT_PROFILE = "https://www.ankurhalder.in/apple-icon.png";

const ProfileHeader = ({ user, profileImage, updateProfileImage }) => {
  const colors = useThemeColors();
  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  return (
    <View
      style={[styles.profileContainer, { backgroundColor: colors.secondary }]}
    >
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
          style={[styles.profileImage, { borderColor: colors.text }]}
          accessible={true}
          accessibilityLabel="Profile image"
          onError={() => setProfileError(true)}
        />
        <UpdateUserProfileImage updateProfileImage={updateProfileImage} />
      </View>
      <Text
        style={[styles.name, { color: colors.text }]}
      >{`${user.firstName} ${user.lastName}`}</Text>
      <Text style={[styles.username, { color: colors.text }]}>
        @{user.username}
      </Text>
      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: colors.text }]}>
          📧 {user.email}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          📞 {user.phone}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          🎂 Age: {user.age}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          ⚧ Gender: {user.gender}
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🏢 Work
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          {user.company.title} at {user.company.name} ({user.company.department}
          )
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          📍 Address
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
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
    borderRadius: 20,
  },
  coverImage: {
    width: "100%",
    height: 100,
    marginBottom: -50,
  },
  profileImageContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default ProfileHeader;
