import { useEffect } from "react";

/**
 * useInactivityTimeout
 * - Default timeout: 10 minutes
 * - Warns (dispatches 'idle_warning') warningDuration ms before actual logout and dispatches 'idle_logout' on logout
 * - Pauses when there is no auth token
 */
const useInactivityTimeout = (timeout = 10 * 60 * 1000, warningDuration = 60 * 1000) => {

    const fullyLogoutPWA = async () => {
        try {
            // Notify listeners that logout is happening
            try { window.dispatchEvent(new CustomEvent('idle_logout')); } catch (e) {/* ignore */}

            // Emit telemetry for audit/security purposes (best-effort)
            try {
                // lazy import to avoid circular deps
                const { logAutoLogout } = await import('@/utils/telemetry');
                const storedUser = localStorage.getItem('user');
                let userId = null;
                try { userId = storedUser ? JSON.parse(storedUser).id : null; } catch (e) { userId = null; }
                logAutoLogout({ reason: 'idle_timeout', userId, path: window.location.pathname });
            } catch (e) {
                /* ignore telemetry errors */
            }

            // 1️⃣ Clear all storage
            localStorage.clear();
            sessionStorage.clear();

            // 2️⃣ Clear PWA caches
            if ("caches" in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map((cache) => caches.delete(cache)));
            }

            // 3️⃣ Unregister service workers
            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const reg of registrations) {
                    await reg.unregister();
                }
            }

            // 4️⃣ Redirect to login (force reload to avoid cached content)
            window.location.replace(`${window.location.origin}${window.location.pathname}#/login`);
            window.location.reload();

        } catch (error) {
            window.location.replace(`${window.location.origin}${window.location.pathname}#/login`);
        }
    };


    useEffect(() => {
        let logoutTimer: ReturnType<typeof setTimeout> | null = null;
        let warningTimer: ReturnType<typeof setTimeout> | null = null;

        const stopTimers = () => {
            if (logoutTimer) {
                clearTimeout(logoutTimer);
                logoutTimer = null;
            }
            if (warningTimer) {
                clearTimeout(warningTimer);
                warningTimer = null;
            }
        };

        const scheduleTimers = () => {
            stopTimers();

            // Only schedule if there's an auth token
            const token = localStorage.getItem('token');
            if (!token) return;

            // Schedule warning if applicable
            if (warningDuration > 0 && timeout > warningDuration) {
                warningTimer = setTimeout(() => {
                    try { window.dispatchEvent(new CustomEvent('idle_warning')); } catch (e) { /* ignore */ }
                }, timeout - warningDuration);
            }

            // Schedule final logout
            logoutTimer = setTimeout(() => {
                fullyLogoutPWA();
            }, timeout);
        };

        const resetTimersOnActivity = () => {
            scheduleTimers();
        };

        // Activity events
        const events = ["mousemove", "keydown", "click", "touchstart", "pointerdown"];
        events.forEach(event => window.addEventListener(event, resetTimersOnActivity));

        // Pause timers when tab is hidden and resume when visible
        const handleVisibility = () => {
            if (document.hidden) {
                stopTimers();
            } else {
                scheduleTimers();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // Listen for token changes across tabs
        const storageListener = (e: StorageEvent) => {
            if (e.key === 'token') {
                if (e.newValue) {
                    // token appeared or refreshed
                    scheduleTimers();
                } else {
                    // token removed -> stop timers
                    stopTimers();
                }
            }
        };
        window.addEventListener('storage', storageListener);

        // Listen for manual reset (e.g. user clicked "Stay signed in")
        const idleResetListener = () => {
            try { scheduleTimers(); } catch (e) { /* ignore */ }
        };
        window.addEventListener('idle_reset', idleResetListener);

        // Start only if token exists
        scheduleTimers();

        return () => {
            stopTimers();
            events.forEach(event => window.removeEventListener(event, resetTimersOnActivity));
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('storage', storageListener);
            window.removeEventListener('idle_reset', idleResetListener);
        };
    }, [timeout, warningDuration]);
};

export default useInactivityTimeout;
