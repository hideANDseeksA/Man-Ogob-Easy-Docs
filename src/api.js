import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // FastAPI backend URL

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/create_user`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw error;
  }
};
