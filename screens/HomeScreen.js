import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Share,
  Text,
  RefreshControl,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import fetchAllData from "../functions/fetchAllData";
import processData from "../functions/processData";
import PostItem from "../components/PostItem";
import CommentModal from "../components/CommentModal";
import { debounce } from "lodash";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const limit = 10;
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("cachedPosts");
        const lastUpdated = await AsyncStorage.getItem("lastUpdated");

        const isDataOld = lastUpdated
          ? Date.now() - JSON.parse(lastUpdated) > 5 * 60 * 1000
          : true;

        if (storedData && !isDataOld) {
          const parsedData = JSON.parse(storedData);
          setAllPosts(parsedData);
          setPosts(parsedData.slice(0, limit));
          setLoading(false);
        } else {
          await fetchAndCacheData();
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load posts. Please try again.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.6,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const fetchAndCacheData = async () => {
    setLoading(true);
    try {
      const { users, posts, comments } = await fetchAllData(setLoading);
      const processedPosts = processData(users, posts, comments);

      await AsyncStorage.setItem("cachedPosts", JSON.stringify(processedPosts));
      await AsyncStorage.setItem("lastUpdated", JSON.stringify(Date.now()));

      setAllPosts(processedPosts);
      setPosts(processedPosts.slice(0, limit));
    } catch (error) {
      Alert.alert("Error", "Failed to refresh posts.");
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    setRefreshing(true);
    // await AsyncStorage.removeItem("cachedPosts");
    await fetchAndCacheData();
    setRefreshing(false);
  };

  const loadMorePosts = () => {
    if (loadingMore || posts.length >= allPosts.length) return;

    setLoadingMore(true);
    setTimeout(() => {
      setPosts((prevPosts) => [
        ...prevPosts,
        ...allPosts.slice(prevPosts.length, prevPosts.length + limit),
      ]);
      setLoadingMore(false);
    }, 1000);
  };

  const handleLike = debounce((postId, liked) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                likes: liked
                  ? post.reactions.likes + 1
                  : post.reactions.likes - 1,
              },
            }
          : post
      )
    );
  }, 300);

  const openComments = (comments) => {
    setSelectedComments(comments);
    setModalVisible(true);
  };

  const handleShare = async (postId) => {
    try {
      const postUrl = `https://www.ankurhalder.in/${postId}`;
      await Share.share({ message: `Check out this post: ${postUrl}` });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleImagePress = (userData) => {
    navigation.navigate("ProfileDetail", { userData });
  };

  const renderItem = useCallback(
    ({ item }) => (
      <PostItem
        item={item}
        handleLike={handleLike}
        openComments={openComments}
        handleShare={handleShare}
        handleImagePress={handleImagePress}
      />
    ),
    []
  );

  const SkeletonLoader = () => (
    <View>
      {[...Array(5)].map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.skeletonContainer, { opacity: fadeAnim }]}
        >
          <View style={styles.skeletonProfile} />
          <View style={styles.skeletonTextContainer}>
            <View style={styles.skeletonText} />
            <View style={[styles.skeletonText, { width: "50%" }]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}

      {loading ? (
        <SkeletonLoader />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          initialNumToRender={8}
          windowSize={5}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshPosts} />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" />
                <Text style={styles.loadingText}>Loading more...</Text>
              </View>
            ) : null
          }
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
  container: { flex: 1, padding: 10, backgroundColor: "#f8f9fa" },
  noInternet: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  skeletonProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  skeletonTextContainer: { marginLeft: 10 },
  skeletonText: {
    width: 120,
    height: 12,
    backgroundColor: "#ddd",
    marginTop: 6,
    borderRadius: 4,
  },
});

export default HomeScreen;
