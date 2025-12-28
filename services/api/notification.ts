import { UserRole } from '@/types';
import { API } from '../api';

export const getNotificationsAPI = async (role: string) => {
    try {
        const apiUrl = role === UserRole.ADMIN ? '/api/admin/notifications' : '/api/notifications';
        const response = await API.get(`${apiUrl}?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }       
}

export const markAsReadNotificationAPI = async (notificationId: string, role: UserRole) => {
    const apiUrl = role === UserRole.ADMIN ? '/api/admin/notifications' : '/api/notifications';
    try {
        const response = await API.patch(`${apiUrl}/${encodeURIComponent(notificationId)}/read`);
        return response.data;
    } catch (error) {
        console.error(`Error marking notification ${notificationId} as read:`, error);
        throw error;
    }
};

export const markAllReadNotificationAPI = async (role: UserRole) => {
    const apiUrl = role === UserRole.ADMIN ? '/api/admin/notifications' : '/api/notifications';
    try {
        const response = await API.patch(`${apiUrl}/readAll`);
        return response.data;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

