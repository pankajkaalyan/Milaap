import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import NotificationPanel from './NotificationPanel';
import Spinner from '../ui/Spinner';
import { AppEventStatus, SpinnerSize, UserRole } from '../../types';
import { eventBus } from '../../utils/eventBus';
import { use } from 'framer-motion/client';

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);


const NotificationBell: React.FC = () => {
    const { user, notifications, getNotifications } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Ensure we fetch notifications only once per session/load
    const fetchedRef = useRef(false);
    const isMountedRef = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    const fetchNotificationsOnce = useCallback(async (role: UserRole) => {
        // 1. Guard: Check if already fetching, already fetched, or missing credentials
        if (fetchedRef.current || isFetching || !localStorage.getItem('token') || !role) return;

        fetchedRef.current = true;
        setIsFetching(true);

        const maxRetries = 3;
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        const attemptFetch = async (attempt: number): Promise<void> => {
            try {
                await getNotifications(role);
            } catch (e) {
                if (attempt < maxRetries && isMountedRef.current) {
                    console.warn(`Fetch failed. Retry ${attempt}/${maxRetries}...`);

                    // Wait before retrying (e.g., 2 seconds)
                    await delay(2000);
                    return attemptFetch(attempt + 1);
                } else {
                    // All retries failed or component unmounted
                    fetchedRef.current = false;
                }
            }
        };

        try {
            await attemptFetch(1);
        } finally {
            if (isMountedRef.current) {
                setIsFetching(false);
            }
        }
    }, [getNotifications, isFetching]);

    useEffect(() => {
        // track mount status for safe state updates
        isMountedRef.current = true;
        return () => { isMountedRef.current = false; };
    }, []);

    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.isRead).length;
    }, [notifications]);

    // Close panel when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        // Only fetch if the notifications array is empty
        // This prevents re-fetching every time the panel is opened/closed
        if (notifications.length === 0) {
            fetchNotificationsOnce(user.role).catch(() => { /* ignore */ });
        }
    }, [notifications.length, fetchNotificationsOnce]);

    // When user logs in, refresh notifications
    useEffect(() => {
        const onLogin = ({ role }) => {
            try { fetchNotificationsOnce(role); } catch (e) { /* ignore */ }
        };
        eventBus.on(AppEventStatus.LOGIN_SUCCESS, onLogin);
        return () => eventBus.off(AppEventStatus.LOGIN_SUCCESS, onLogin);
    }, [fetchNotificationsOnce]);

    const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);
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
                {isFetching && (
                    <span className="absolute -bottom-1 -right-1">
                        <Spinner size={SpinnerSize.SM} />
                    </span>
                )}
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