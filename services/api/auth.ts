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

export const forgotPasswordAPI = async (email) => {
    try {
        const response = await API.post("/api/auth/forgot-password", { email });
        return response.data;
    } catch (error) {
        console.error("Error sending forgot password email:", error);
        throw error;
    }
};

export const changePasswordAPI = async (token: string, newPassword: string) => {
    try {
        const payload = {
            token,
            newPassword,
        };

        const response = await API.post("/api/auth/change-password", payload);

        return response.data;
    } catch (error) {
        console.error("Error changing password:", error?.response?.data || error);
        throw error;
    }
};
 


import axios from 'axios';

export const refreshTokenAPI = async () => {
    try {
        // Use a direct axios call (bypass main API instance) to avoid interceptor recursion
        const baseURL = import.meta.env.MODE === 'development' ? '' : import.meta.env.VITE_API_URL;
        const response = await axios.post(`${baseURL}/api/auth/refresh-token`, {
            refreshToken: localStorage.getItem('refreshToken'),
        }, { headers: { 'Content-Type': 'application/json' } });
        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

export const blockUserAPI = async (targetUserId) => {
    try {
        const response = await API.post(`/api/user-interactions/block/${targetUserId}`);
        return response.data;
    } catch (error) {
        console.error("Error blocking user:", error);
        throw error;
    }
};

export const unblockUserAPI = async (targetUserId) => {
    try {
        const response = await API.delete(`/api/user-interactions/block/${targetUserId}`);
        return response.data;
    } catch (error) {
        console.error("Error unblocking user:", error);
        throw error;
    }
};

export const reportUserAPI = async ({ reportedId, reason, description }) => {
    try {
        const payload = {
            reportedId,
            reason,
            description,
        };

        const response = await API.post("/api/report", payload);
        return response.data;

    } catch (error) {
        console.error("Error reporting user:", error);
        throw error;
    }
};

