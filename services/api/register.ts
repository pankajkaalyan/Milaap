import { API } from "../api";

export const registerAPI = async (userData) => {
    try {
        const response = await API.post("/api/auth/signup", userData);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};
