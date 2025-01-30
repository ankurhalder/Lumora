import axios from "axios";

const API_URL = "https://dummyjson.com/posts";

export const fetchPosts = async (page = 0, limit = 20, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.get(API_URL, {
      params: { page, limit },
    });
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
