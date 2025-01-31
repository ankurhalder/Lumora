export const fetchUserById = async (userId) => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${userId}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { image: "https://www.ankurhalder.in/apple-icon.png" };
  }
};
