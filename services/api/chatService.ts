import { API } from "../api";

export const getChatConversationsAPI = async () => {
    try {
        const response = await API.get(`/api/conversations?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};

export const getConversationMessagesAPI = async (roomId: string | number) => {
    try {
        const response = await API.get(`/api/chat/rooms/${roomId}/messages?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching conversation messages:", error);
        throw error;
    }
};