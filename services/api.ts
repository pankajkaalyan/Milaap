import axios from "axios";

// Base instance
export const API = axios.create({
    baseURL: "http://localhost:9999", // Example API
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example GET request
export const fetchPosts = async () => {
    try {
        const response = await API.get("/posts");
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};

// Example POST request
export const createPost = async (postData) => {
    try {
        const response = await API.post("/posts", postData);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};


