import { API } from "../api";

export const getMutualMatchesAPI = async () => {
    try {
        const response = await API.get("/api/connections");
        return response.data;
    } catch (error) {
        console.error("Error fetching mutual matches data:", error);
        throw error;
    }
};
