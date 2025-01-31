import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ProfileDetailScreen = ({ route }) => {
  const { profileId, profileName, profileImage } = route.params || {};

  return (
    <View style={styles.container}>
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
      <Text style={styles.name}>{profileName}</Text>
      <Text style={styles.id}>Profile ID: {profileId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  id: {
    fontSize: 16,
    color: "gray",
  },
});

export default ProfileDetailScreen;
