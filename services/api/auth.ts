import { API } from "../api";

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
        const response = await API.post("/api/auth/logout")
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

