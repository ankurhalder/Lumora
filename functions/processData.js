const processData = (users, posts, comments) => {
  const userMap = {};
  users.forEach((user) => {
    userMap[user.id] = user;
  });

  const postCommentMap = {};
  comments.forEach((comment) => {
    if (!postCommentMap[comment.postId]) {
      postCommentMap[comment.postId] = [];
    }
    postCommentMap[comment.postId].push(comment);
  });

  const processedPosts = posts.map((post) => ({
    ...post,
    user: userMap[post.userId] || { username: "Unknown", image: "" },
    comments: postCommentMap[post.id] || [],
  }));

  return processedPosts;
};

export default processData;
