import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import NotificationPanel from './NotificationPanel';
import Spinner from '../ui/Spinner';
import { AppEventStatus, SpinnerSize, UserRole } from '../../types';
import { eventBus } from '../../utils/eventBus';

const BellIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
    </svg>
);

const NotificationBell: React.FC = () => {
    const { user, notifications, getNotifications } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch-once guard
    const fetchedRef = useRef(false);

    /**
     * Fetch notifications only once per mount/session
     */
    const fetchNotificationsOnce = useCallback(
        async (role: UserRole) => {
            if (!localStorage.getItem('token') || !role) return;
            if (fetchedRef.current) return;

            fetchedRef.current = true; // lock immediately

            try {
                await getNotifications(role);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
                fetchedRef.current = false; // unlock so future attempt is allowed
            }
        },
        [getNotifications]
    );

    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.isRead).length;
    }, [notifications]);

    /**
     * Close panel on outside click
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Initial fetch (ONLY ONCE)
     * Do NOT depend on notifications.length → that causes loops
     */
    useEffect(() => {
        fetchNotificationsOnce(user.role);
    }, [user.role, fetchNotificationsOnce]);

    /**
     * Fetch again on LOGIN_SUCCESS (optional but safe)
     */
    useEffect(() => {
        const onLogin = ({ role }: { role: UserRole }) => {
            fetchedRef.current = false; // allow fresh fetch after login
            fetchNotificationsOnce(role);
        };

        eventBus.on(AppEventStatus.LOGIN_SUCCESS, onLogin);
        return () => {
            eventBus.off(AppEventStatus.LOGIN_SUCCESS, onLogin);
        };
    }, [fetchNotificationsOnce]);

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={toggleOpen}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                className="relative text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label={`${unreadCount} new notifications`}
            >
                <BellIcon />

                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && <NotificationPanel onClose={() => setIsOpen(false)} />}
        </div>
    );
};

export default NotificationBell;
