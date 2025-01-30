import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileDetailScreen = ({ route }) => {
  const { userId } = route.params; // Receive userId from the navigation

  // Here you can fetch the user details based on userId
  // For now, let's simulate data

  const userDetails = {
    id: userId,
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    bio: "This is a short bio of John Doe.",
  };

  return (
    <View style={styles.container}>
      <Text
        style={styles.fullName}
      >{`${userDetails.firstName} ${userDetails.lastName}`}</Text>
      <Text style={styles.username}>@{userDetails.username}</Text>
      <Text style={styles.email}>{userDetails.email}</Text>
      <Text style={styles.bio}>{userDetails.bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  username: {
    fontSize: 18,
    color: "gray",
  },
  email: {
    fontSize: 16,
    color: "blue",
  },
  bio: {
    marginTop: 20,
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
});

export default ProfileDetailScreen;
