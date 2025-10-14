import { API } from "../api";

export const fetchInterestsAPI = async () => {
    try {
        const response = await API.get("/api/interests");
        return response.data;
    } catch (error) {
        console.error("Error fetching interests:", error);
        throw error;
    }
};

export const sendInterestAPI = async (recipientId: number, message: string) => {
    try {
        const response = await API.post("/api/interests", { recipientId, message });
        return response.data;
    } catch (error) {
        console.error("Error sending interest:", error);
        throw error;
    }
};
