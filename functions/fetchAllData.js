import axios from "axios";

const fetchAllData = async (setLoading) => {
  setLoading(true);
  let users = [];
  let posts = [];
  let comments = [];
  let hasMoreUsers = true;
  let hasMorePosts = true;
  let hasMoreComments = true;
  let limit = 30;
  let skipUsers = 0;
  let skipPosts = 0;
  let skipComments = 0;

  try {
    // Fetch all users
    while (hasMoreUsers) {
      const userRes = await axios.get(
        `https://dummyjson.com/users?limit=${limit}&skip=${skipUsers}`
      );
      users = [...users, ...userRes.data.users];
      skipUsers += limit;
      hasMoreUsers = userRes.data.users.length === limit;
    }

    // Fetch all posts
    while (hasMorePosts) {
      const postRes = await axios.get(
        `https://dummyjson.com/posts?limit=${limit}&skip=${skipPosts}`
      );
      posts = [...posts, ...postRes.data.posts];
      skipPosts += limit;
      hasMorePosts = postRes.data.posts.length === limit;
    }

    // Fetch all comments
    while (hasMoreComments) {
      const commentRes = await axios.get(
        `https://dummyjson.com/comments?limit=${limit}&skip=${skipComments}`
      );
      comments = [...comments, ...commentRes.data.comments];
      skipComments += limit;
      hasMoreComments = commentRes.data.comments.length === limit;
    }

    return { users, posts, comments };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { users: [], posts: [], comments: [] };
  } finally {
    setLoading(false);
  }
};

export default fetchAllData;
