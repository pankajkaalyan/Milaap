import { useEffect } from "react";

const useInactivityTimeout = (timeout = 10 * 60 * 1000) => {

    const fullyLogoutPWA = async () => {
        try {
            // console.log("🔁 Auto-logout triggered (inactive).");

            // 1️⃣ Clear all storage
            localStorage.clear();
            sessionStorage.clear();

            // 2️⃣ Clear PWA caches
            if ("caches" in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map((cache) => caches.delete(cache)));
                // console.log("🧹 All caches cleared");
            }

            // 3️⃣ Unregister service workers
            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const reg of registrations) {
                    await reg.unregister();
                }
                // console.log("🛑 Service workers unregistered");
            }

            // 4️⃣ Reload from network NOT from cache
            window.location.href = "/login";
            window.location.reload();

        } catch (error) {
            // console.error("Logout cleanup failed:", error);
            window.location.href = "/login";
        }
    };


    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fullyLogoutPWA();
            }, timeout);
        };

        // Watch user activity events
        const events = ["mousemove", "keydown", "click", "touchstart"];
        events.forEach(event => window.addEventListener(event, resetTimer));

        resetTimer(); // Start timer immediately

        return () =>
            events.forEach(event => window.removeEventListener(event, resetTimer));
    }, [timeout]);
};

export default useInactivityTimeout;
