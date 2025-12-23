import { API } from "../api";

export const getDashboardDataAPI = async () => {
    try {
        const response = await API.get(`/api/dashboard?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};

export const addToFavouritesAPI = async (targetUserId: string | number) => {
    try {
        const response = await API.post(`/api/user-interactions/favourite/${targetUserId}`);
        return response.data;
    } catch (error) {
        console.error("Error adding to favourite:", error);
        throw error;
    }
};

export const removeFromFavouritesAPI = async (targetUserId: string | number) => {
    try {
        const response = await API.delete(`/api/user-interactions/favourite/${targetUserId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing from favourite:", error);
        throw error;
    }
};
