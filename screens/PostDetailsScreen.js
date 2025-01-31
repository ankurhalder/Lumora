import React from "react";
import { View, Text, Image, ScrollView } from "react-native";

const ProfileDetailScreen = ({ route }) => {
  const { userData } = route.params || {};

  if (!userData) {
    return (
      <View>
        <Text>No User Data Available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainer>
      <View>
        <Image
          source={{
            uri: userData.image || "https://www.ankurhalder.in/apple-icon.png",
          }}
        />
      </View>
      <View>
        <Text>{`${userData.firstName} ${
          userData.maidenName ? userData.maidenName + " " : ""
        }${userData.lastName}`}</Text>
        <Text>@{userData.username}</Text>
      </View>
      <View>
        <Text>Email: {userData.email}</Text>
        <Text>Phone: {userData.phone}</Text>
        <Text>Age : {userData.age}</Text>
        <Text>Gender : {userData.gender}</Text>
      </View>
      <View>
        <Text>
          Occupation: {userData.company?.department} at {userData.company?.name}{" "}
          as
          {userData.company?.title}
        </Text>
      </View>
      <View>
        <Text>
          Address: {userData.address?.address}, {userData.address?.city},
          {userData.address?.state} , {userData.address?.country}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileDetailScreen;
