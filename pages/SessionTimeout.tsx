import { useEffect } from "react";

const SESSION_TIMEOUT = 29 * 60 * 1000; // 29 minutes

const useSessionTimeout = () => {
    useEffect(() => {
        const checkSession = async () => {
            const loginTime = localStorage.getItem("loginTime");
            if (!loginTime) return;

            const expired = Date.now() - Number(loginTime) > SESSION_TIMEOUT;
            if (!expired) return;

            // console.warn("⏳ Session expired — clearing PWA cache and redirecting...");

            // 1️⃣ Clear storage
            localStorage.clear();
            sessionStorage.clear();

            // 2️⃣ Clear PWA cache
            if ("caches" in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
                // console.log("🧹 PWA Cache Cleared");
            }

            // 3️⃣ Unregister all service workers
            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const reg of registrations) {
                    await reg.unregister();
                }
                // console.log("🧹 All Service Workers Unregistered");
            }

            // 4️⃣ Redirect to login
            window.location.href = "/login";

            // 5️⃣ Hard reload from server (avoid stale PWA content)
            setTimeout(() => window.location.reload(), 200);
        };

        const interval = setInterval(checkSession, 60000); // Check every 1 min
        return () => clearInterval(interval);
    }, []);
};

export default useSessionTimeout;
