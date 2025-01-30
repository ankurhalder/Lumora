import axios from "axios";

const API_URL = "https://dummyjson.com/comments";

export const fetchComments = async (
  postId,
  page = 0,
  limit = 20,
  setLoading
) => {
  setLoading(true);
  try {
    const response = await axios.get(API_URL, {
      params: { postId, page, limit },
    });
    return response.data.comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
