
import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationType, User, Interest, InterestStatus, UserRole, Interests } from '../types';
import { mockUsers } from '../data/mockUsers';
import { getNotificationsAPI, markAllReadNotificationAPI, markAsReadNotificationAPI } from '@/services/api/notification';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;
export const useNotifications = (user: User | null, t: TFunction, setInterests: React.Dispatch<React.SetStateAction<Interests>>, addToast: AddToastFunction) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            // console.log("⏳ Loaded notifications from localStorage", JSON.parse(storedNotifications));
            // setNotifications(JSON.parse(storedNotifications));
        }
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => {
        // const newNotification: Notification = {
        //     ...notification,
        //     id: new Date().toISOString() + Math.random(),
        //     isRead: false,
        //     timestamp: new Date().toISOString(),
        // };
        // setNotifications(prev => {
        //     const updated = [newNotification, ...prev].slice(0, 20); // Keep max 20 notifications
        //     localStorage.setItem('notifications', JSON.stringify(updated));
        //     return updated;
        // });
    }, []);

    // Effect to simulate real-time notifications
    useEffect(() => {
        if (!user) return;

        let intervalId: number;

        // if (user.role === UserRole.CUSTOMER) {
        //     intervalId = window.setInterval(() => {
        //         const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        //         if (randomUser.id === user.id) return; // Avoid self-notification

        //         const notificationTypes: NotificationType[] = [
        //             NotificationType.PROFILE_VIEW,
        //             NotificationType.NEW_MATCH,
        //             NotificationType.INTEREST_RECEIVED,
        //             NotificationType.NEW_MESSAGE,
        //             NotificationType.INTEREST_ACCEPTED,
        //         ];
        //         const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

        //         let message = '';
        //         let link = '';

        //         switch (randomType) {
        //             case NotificationType.PROFILE_VIEW:
        //                 message = t('notifications.profile_view', { name: randomUser.name });
        //                 link = `/profile/${randomUser.id}`;
        //                 break;
        //             case NotificationType.NEW_MATCH:
        //                 message = t('notifications.new_match', { name: randomUser.name });
        //                 link = `/matches`;
        //                 break;
        //             case NotificationType.INTEREST_RECEIVED:
        //                 message = t('notifications.interest_received', { name: randomUser.name });
        //                 link = '/interests';
        //                 // Mock receiving an interest
        //                 // setInterests(prev => {
        //                 //     if (prev && prev.received.some(i => i.senderId === randomUser.id && i.recipientId === user.id)) return prev;
        //                 //     const newInterest: Interest = {
        //                 //         id: Date.now(),
        //                 //         senderId: randomUser.id as number,
        //                 //         recipientId: user.id as number,
        //                 //         status: InterestStatus.PENDING,
        //                 //         timestamp: new Date().toISOString(),
        //                 //     };
        //                 //     return [newInterest, ...prev.received];
        //                 // });
        //                 break;
        //             case NotificationType.NEW_MESSAGE:
        //                 const randomConvoUser = mockUsers[Math.floor(Math.random() * 8)]; // Users with mock convos
        //                 if (randomConvoUser.id === user.id) return;
        //                 message = t('notifications.new_message', { name: randomConvoUser.name });
        //                 link = `/messages/${randomConvoUser.id}`;
        //                 break;
        //             case NotificationType.INTEREST_ACCEPTED:
        //                 message = t('notifications.interest_accepted', { name: randomUser.name });
        //                 link = '/mutual-matches';
        //                 break;
        //             default: return;
        //         }

        //         addNotification({
        //             type: randomType,
        //             message,
        //             link,
        //             userName: randomUser.name,
        //             userId: randomUser.id as number
        //         });

        //     }, 45000); // Every 45 seconds for customers
        // } else if (user.role === UserRole.ADMIN) {
        //     intervalId = window.setInterval(() => {
        //         const adminNotificationTypes: NotificationType[] = [NotificationType.ADMIN_NEW_VERIFICATION, NotificationType.ADMIN_NEW_REPORT, NotificationType.ADMIN_NEW_STORY];
        //         const randomType = adminNotificationTypes[Math.floor(Math.random() * adminNotificationTypes.length)];
        //         const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

        //         let message = '';
        //         let link = '';

        //         switch (randomType) {
        //             case NotificationType.ADMIN_NEW_VERIFICATION:
        //                 message = `${randomUser.name} submitted for verification.`;
        //                 link = '/admin/verification-requests';
        //                 break;
        //             case NotificationType.ADMIN_NEW_REPORT:
        //                 const reporter = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        //                 message = `${reporter.name} reported ${randomUser.name}.`;
        //                 link = '/admin/reports';
        //                 break;
        //             case NotificationType.ADMIN_NEW_STORY:
        //                 message = `${randomUser.name} & Partner submitted a new success story.`;
        //                 link = '/admin/story-submissions';
        //                 break;
        //             default: return;
        //         }

        //         addNotification({ type: randomType, message, link });

        //     }, 60000); // Every 60 seconds for admins
        // }


        // return () => clearInterval(intervalId);
    }, [user, addNotification, t, setInterests]);

    const markNotificationAsRead = async (notificationId: string, role : UserRole) => {
        // Ensure the specific notification exists and is unread
        const target = notifications.find(n => n.id === notificationId);
        if (!target) {
            console.warn("Notification not found:", notificationId);
            return; // Nothing to mark
        }
        if (target.isRead) {
            return; // Already marked as read
        }

        // Optimistic update
        let previous: Notification[] = [];
        setNotifications(prev => {
            previous = prev;
            const updated = prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
            // localStorage.setItem('notifications', JSON.stringify(updated));
            return updated;
        });

        try {
            await markAsReadNotificationAPI(notificationId, role);
        } catch (err) {
            console.error("Failed to mark notification read:", err);
            addToast("Failed to mark notification as read.", "error");
            // rollback on failure
            setNotifications(previous);
            // localStorage.setItem('notifications', JSON.stringify(previous));
        }
    };

    const markAllNotificationsAsRead = async (role: UserRole) => {
        // Quick check: if there are no unread notifications, no-op
        if (!notifications.some(n => !n.isRead)) {
            return; // No unread notifications
        }

        // Optimistic update
        let previous: Notification[] = [];
        setNotifications(prev => {
            previous = prev;
            const updated = prev.map(n => ({ ...n, isRead: true }));
            localStorage.setItem('notifications', JSON.stringify(updated));
            return updated;
        });

        try {
            await markAllReadNotificationAPI(role);
        } catch (err) {
            console.error("Failed to mark all notifications read:", err);
            addToast("Failed to mark all notifications as read.", "error");
            // rollback on failure
            setNotifications(previous);
            localStorage.setItem('notifications', JSON.stringify(previous));
        }
    };

    const getNotifications = async (role: UserRole) => {
        if (!role) return [];
        try {
            const notificationData = await getNotificationsAPI(role);
            setNotifications(notificationData);
            localStorage.setItem('notifications', JSON.stringify(notificationData));
            return notificationData;
        } catch (err) {
            addToast("Failed to load Notifications Data.", "error");
            console.error("getNotifications error:", err);
            throw err;
        }
    };

    return {
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getNotifications
    };
};
