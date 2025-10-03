import axios from "axios";

// Base instance
const API = axios.create({
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

export const loginAPI = async (credentials) => {
    try {
        const response = await API.post("/api/auth/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const logoutAPI = async () => {
    const token = localStorage.getItem("token");
    console.log("Logging out with token:", token);
    try {
        const response = await API.post("/api/auth/logout" )
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};
