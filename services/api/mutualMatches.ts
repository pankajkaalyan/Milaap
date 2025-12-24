import { API } from "../api";

export const getMutualMatchesAPI = async () => {
    try {
        const response = await API.get(`/api/connections?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching mutual matches data:", error);
        throw error;
    }
};
