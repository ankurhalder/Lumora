import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const ProfileDetailScreen = ({ route }) => {
  const { userData } = route.params || {};

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No User Data Available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: userData.image || "https://www.ankurhalder.in/apple-icon.png",
        }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{`${userData.firstName} ${
        userData.maidenName ? userData.maidenName + " " : ""
      }${userData.lastName}`}</Text>
      <Text style={styles.username}>@{userData.username}</Text>
      <Text style={styles.email}>Email: {userData.email}</Text>
      <Text style={styles.phone}>Phone: {userData.phone}</Text>
      <Text style={styles.address}>
        Address: {userData.address?.street}, {userData.address?.city},{" "}
        {userData.address?.state}
      </Text>
      {console.log("Full User Data:", userData)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  username: {
    fontSize: 18,
    color: "gray",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
  },
  phone: {
    fontSize: 16,
    color: "gray",
  },
  address: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 5,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default ProfileDetailScreen;
