import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { NotificationType } from '../../types';
import FlagIcon from '../icons/FlagIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import XCircleIcon from '../icons/XCircleIcon';
import StarIcon from '../icons/StarIcon';
import { eventBus } from '@/utils/eventBus';
import { AppEventStatus } from '@/types';
import { use } from 'framer-motion/client';

const MessageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;

interface NotificationIconProps {
    type: NotificationType;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ type }) => {
    switch (type) {
        case NotificationType.NEW_MESSAGE:
            return <MessageIcon className="h-6 w-6" />;
        case NotificationType.PROFILE_VIEW:
        case NotificationType.ADMIN_NEW_VERIFICATION:
            return <UserIcon className="h-6 w-6" />;
        case NotificationType.NEW_MATCH:
        case NotificationType.INTEREST_RECEIVED:
        case NotificationType.INTEREST_ACCEPTED:
            return <HeartIcon className="h-6 w-6" />;
        case NotificationType.ADMIN_NEW_REPORT:
            return <FlagIcon className="h-6 w-6" />;
        case NotificationType.VERIFICATION_APPROVED:
            return <CheckCircleIcon className="w-6 h-6 text-green-400" />;
        case NotificationType.VERIFICATION_REJECTED:
            return <XCircleIcon className="w-6 h-6 text-red-400" />;
        case NotificationType.STORY_APPROVED:
            return <StarIcon className="w-6 h-6 text-yellow-400" />;
        case NotificationType.STORY_REJECTED:
            return <HeartIcon className="h-6 w-6 text-gray-400" />;
        case NotificationType.ADMIN_NEW_STORY:
            return <StarIcon className="w-6 h-6 text-yellow-400" />;
        default:
            return <HeartIcon className="h-6 w-6" />; // Default icon
    }
};

interface NotificationPanelProps {
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead, t } = useAppContext();
    const navigate = useNavigate();

    const handleNotificationClick = (notificationId: string, link: string) => {
        markNotificationAsRead(notificationId);
        // Ensure hamburger/mobile menu (and other mobile/medium popups) close immediately on notification click
        try { eventBus.emit(AppEventStatus.ROUTE_CHANGE, { isMobileOrMedium: window.innerWidth < 1024 }); } catch (e) { /* ignore */ }
        navigate(link);
        onClose();
    };

    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        markAllNotificationsAsRead();
    }

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    console.log("Notifications:", notifications);
    
    return (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-20 animate-fade-in-up-fast overflow-hidden flex flex-col max-h-[70vh]">
            <div className="p-3 flex justify-between items-center border-b border-gray-700">
                <h3 className="font-semibold text-white">{t('notifications.title')}</h3>
                <button onClick={handleMarkAllAsRead} className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">
                    {t('notifications.mark_all_read')}
                </button>
            </div>
            {notifications.length > 0 ? (
                <ul className="divide-y divide-gray-700 overflow-y-auto">
                    {notifications.map(n => (
                        <li key={n.id}>
                            <button
                                onClick={() => handleNotificationClick(n.id, n.link)}
                                className={`w-full text-left p-3 flex items-start space-x-3 transition-colors duration-200 ${!n.isRead ? 'bg-amber-900/20' : ''} hover:bg-white/10`}
                            >
                                <div className="relative">
                                    <div className={`p-2 bg-gray-800 rounded-full text-amber-400`}>
                                        <NotificationIcon type={n.type} />
                                    </div>
                                    {!n.isRead && (
                                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-gray-900" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm text-gray-200">{n.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{timeSince(n.timestamp)}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-10 text-center text-gray-400">
                    <p>{t('notifications.no_notifications')}</p>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;