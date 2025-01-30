const processData = (users, posts, comments) => {
  // Map userId to user object
  const userMap = {};
  users.forEach((user) => {
    userMap[user.id] = user;
  });

  // Map postId to comments array
  const postCommentMap = {};
  comments.forEach((comment) => {
    if (!postCommentMap[comment.postId]) {
      postCommentMap[comment.postId] = [];
    }
    postCommentMap[comment.postId].push(comment);
  });

  // Assign users and comments to posts
  const processedPosts = posts.map((post) => ({
    ...post,
    user: userMap[post.userId] || { username: "Unknown", image: "" },
    comments: postCommentMap[post.id] || [],
  }));

  return processedPosts;
};

export default processData;
