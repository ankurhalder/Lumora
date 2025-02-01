import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createStackNavigator } from "@react-navigation/stack";
import fetchAllData from "../functions/fetchAllData";
import debounce from "lodash.debounce";
import ProfileDetailScreen from "./ProfileDetailsScreen";
import SkeletonLoader from "../components/SkeletonLoader";
import { useThemeColors } from "../theme/ThemeProvider";

const LIMIT = 10;
const Stack = createStackNavigator();

const ProfileScreen = ({ navigation }) => {
  const [profiles, setProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchText, setSearchText] = useState("");
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const { background, text, secondary, inactiveTab } = useThemeColors();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    loadProfiles();
    return unsubscribe;
  }, []);

  const loadProfiles = async () => {
    try {
      const lastUpdated = await AsyncStorage.getItem("lastUpdatedProfiles");
      const storedProfiles = await AsyncStorage.getItem("cachedProfiles");

      if (
        storedProfiles &&
        lastUpdated &&
        Date.now() - parseInt(lastUpdated) < 10 * 60
      ) {
        const parsedProfiles = JSON.parse(storedProfiles);
        setAllProfiles(parsedProfiles);
        setProfiles(parsedProfiles.slice(0, LIMIT));
        setLoading(false);
      } else {
        await fetchAndCacheProfiles();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load profiles. Please try again.");
      setLoading(false);
    }
  };

  const fetchAndCacheProfiles = async () => {
    setLoading(true);
    try {
      const { users } = await fetchAllData(setLoading);

      await AsyncStorage.multiSet([
        ["cachedProfiles", JSON.stringify(users)],
        ["lastUpdatedProfiles", Date.now().toString()],
      ]);

      setAllProfiles(users);
      setProfiles(users.slice(0, LIMIT));
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to refresh profiles. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshProfiles = async () => {
    setRefreshing(true);
    await AsyncStorage.multiRemove(["cachedProfiles", "lastUpdatedProfiles"]);
    await fetchAndCacheProfiles();
    setRefreshing(false);
  };

  const loadMoreProfiles = () => {
    if (loadingMore || profiles.length >= allProfiles.length) return;

    setLoadingMore(true);
    setTimeout(() => {
      setProfiles((prevProfiles) => [
        ...prevProfiles,
        ...allProfiles.slice(prevProfiles.length, prevProfiles.length + LIMIT),
      ]);
      setLoadingMore(false);
    }, 1000);
  };

  const handleProfilePress = useCallback(
    debounce((userData) => {
      navigation.navigate("ProfileDetail", { userData });
    }, 300),
    [navigation]
  );

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const filteredProfiles = useMemo(() => {
    if (!searchText) return profiles;

    return profiles.filter((profile) =>
      `${profile.firstName} ${profile.lastName} ${profile.username}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [searchText, profiles]);

  const highlightText = (text, searchText) => {
    if (!searchText) return text;

    const regex = new RegExp(`(${searchText})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === searchText.toLowerCase() ? (
        <Text key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </Text>
      ) : (
        part
      )
    );
  };

  const renderProfileItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[styles.profileCard, { backgroundColor: secondary }]}
        onPress={() => handleProfilePress(item)}
      >
        <Image
          source={{
            uri: item.image || "https://www.ankurhalder.in/apple-icon.png",
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.fullName, { color: text }]}>
            {highlightText(
              `${item.firstName} ${
                item.maidenName ? item.maidenName + " " : ""
              }${item.lastName}`,
              searchText
            )}
          </Text>
          <Text style={[styles.username, { color: inactiveTab }]}>
            {highlightText(`@${item.username}`, searchText)}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [handleProfilePress, background, text, secondary, searchText]
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {isOffline && (
        <Text style={[styles.offlineMessage, { color: secondary }]}>
          You are offline
        </Text>
      )}

      <TextInput
        style={[
          styles.searchInput,
          { backgroundColor: secondary, color: text },
        ]}
        placeholder="Search profiles..."
        placeholderTextColor={inactiveTab}
        value={searchText}
        onChangeText={handleSearchChange}
      />

      {loading ? (
        <SkeletonLoader count={5} />
      ) : filteredProfiles.length === 0 ? (
        <Text style={[styles.emptyMessage, { color: secondary }]}>
          No profiles found.
        </Text>
      ) : (
        <FlatList
          data={filteredProfiles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProfileItem}
          onEndReached={loadMoreProfiles}
          onEndReachedThreshold={0.1}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          windowSize={7}
          viewabilityConfig={viewabilityConfig.current}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshProfiles}
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <SkeletonLoader count={2} style={{ marginBottom: 10 }} />
            ) : null
          }
        />
      )}
    </View>
  );
};

const ProfileStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animationEnabled: true }}
  >
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProfileDetail"
      component={ProfileDetailScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default ProfileStackNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  offlineMessage: {
    textAlign: "center",
    padding: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
});
