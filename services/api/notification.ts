import { API } from '../api';

export const getNotificationsAPI = async () => {
    try {
        const response = await API.get(`/api/notifications?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
}

export const markAsReadNotificationAPI = async (notificationId: string) => {
    try {
        const response = await API.patch(`/api/notifications/${encodeURIComponent(notificationId)}/read`);
        return response.data;
    } catch (error) {
        console.error(`Error marking notification ${notificationId} as read:`, error);
        throw error;
    }
};

export const markAllReadNotificationAPI = async () => {
    try {
        const response = await API.patch(`/api/notifications/readAll`);
        return response.data;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

