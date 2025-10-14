import { API } from "../api";

export const fetchCurrentUserAPI = async () => {
    try {
        const response = await API.get("/api/profile/me2");
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
};