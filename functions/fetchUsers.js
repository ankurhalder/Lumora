import axios from "axios";

const API_URL = "https://dummyjson.com/users";

export const fetchUsers = async (page = 0, limit = 20, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.get(API_URL, {
      params: { page, limit },
    });
    return response.data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
