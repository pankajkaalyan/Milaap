import { API } from "../api";

export const getChatConversationsAPI = async () => {
    try {
        const response = await API.get("/api/conversations");
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};