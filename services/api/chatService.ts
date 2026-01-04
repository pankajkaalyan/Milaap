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

export const getConversationMessagesAPI = async (roomId: string | number, pageNumber: number = 0, pageSize: number = 10000) => {
    try {
        const response = await API.get(`/api/chat/rooms/${roomId}/messages?page=${pageNumber}&size=${pageSize}&ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching conversation messages:", error);
        throw error;
    }
};

export const reportChatMessagesAPI = async (payload: {
  chatId: string | number;
  messageIds: number[];
  reason: string;
}) => {
  try {
    const response = await API.post('/api/chat-report', payload);
    return response.data;
  } catch (error) {
    console.error('Error reporting chat messages:', error);
    throw error;
  }
};
