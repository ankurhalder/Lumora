import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import fetchAllData from "../functions/fetchAllData";
import ProfileDetailScreen from "./PostDetailsScreen";

const LIMIT = 10;
const Stack = createStackNavigator();
const ProfileScreen = ({ navigation }) => {
  const [profiles, setProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadProfiles = async () => {
      const { users } = await fetchAllData(setLoading);
      setAllProfiles(users);
      setProfiles(users.slice(0, LIMIT));
      setLoading(false);
    };

    loadProfiles();
  }, []);

  const loadMoreProfiles = () => {
    if (loadingMore || profiles.length >= allProfiles.length) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextProfiles = allProfiles.slice(0, (page + 1) * LIMIT);
      setProfiles(nextProfiles);
      setPage(page + 1);
      setLoadingMore(false);
    }, 1000);
  };

  const renderProfileItem = ({ item }) => (
    <View
      style={styles.profileCard}
      onTouchEnd={() =>
        navigation.navigate("ProfileDetail", { userId: item.id })
      }
    >
      <Image
        source={{
          uri: item.image || "https://www.ankurhalder.in/apple-icon.png",
        }}
        style={styles.profileImage}
      />
      <View style={styles.profileInfo}>
        <Text
          style={styles.fullName}
        >{`${item.firstName} ${item.lastName}`}</Text>
        <Text style={styles.username}>@{item.username}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProfileItem}
          onEndReached={loadMoreProfiles}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" /> : null
          }
        />
      )}
    </View>
  );
};

const ProfileStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
  </Stack.Navigator>
);

export default ProfileStackNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "gray",
  },
});
