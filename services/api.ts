import axios from "axios";
import { showGlobalLoader, hideGlobalLoader } from "../utils/loaderBus";
import { AppEventStatus } from '../types';
import { storageManager } from "../utils/storageManager";

/* ------------------------------------------------
   🚀 BASE API INSTANCE
---------------------------------------------------*/
export const API = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? ""
            : import.meta.env.VITE_API_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});

/* ------------------------------------------------
   🔑 REQUEST INTERCEPTOR — Add Token + SHOW LOADER
---------------------------------------------------*/
API.interceptors.request.use(
    (config) => {
        showGlobalLoader(); // 👈 SHOW

        const token = storageManager.getItem("token", "local");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        hideGlobalLoader(); // 👈 HIDE (request error)
        return Promise.reject(error);
    }
);

/* ------------------------------------------------
   🛑 RESPONSE INTERCEPTOR — Hide Loader + 401 + Refresh
---------------------------------------------------*/
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

API.interceptors.response.use(
    (response) => {
        hideGlobalLoader(); // 👈 HIDE
        return response;
    },
    async (error) => {
        hideGlobalLoader(); // 👈 HIDE

        const status = error?.response?.status;
        const originalRequest = error?.config;

        // If 401 (unauthorized), attempt to refresh token and retry once
        if (status === 401) {
            // Avoid infinite loop: if request already marked _retry, then logout
            if (originalRequest && originalRequest._retry) {
                await logoutCleanup();
                // Use a hash-aware redirect so HashRouter lands on the expected route
                window.location.replace(`${window.location.origin}${window.location.pathname}#/login`);
                return Promise.reject(error);
            }

            // If a refresh is already in progress, wait for it
            if (!isRefreshing) {
                isRefreshing = true;
                const { refreshTokenAPI } = await import('./api/auth');
                refreshPromise = refreshTokenAPI()
                    .then(result => {
                        if (!result?.accessToken) {
                            console.error('refreshTokenAPI returned unexpected result:', result);
                            throw new Error('No access token in refresh response');
                        }

                        storageManager.setItem('token', result.accessToken, 'local');
                        storageManager.setItem('refreshToken', result.refreshToken, 'local');
                        storageManager.setItem('expiresIn', String(result.expiresIn), 'local');
                        // Notify other parts of the app about the refresh
                        try {
                            window.dispatchEvent(new CustomEvent(AppEventStatus.TOKEN_REFRESHED, { detail: result }));
                        } catch (e) {
                            /* ignore */
                        }
                        isRefreshing = false;
                        return result;
                    })
                    .catch(async (err) => {
                        isRefreshing = false;
                        await logoutCleanup();
                        // Use a hash-aware redirect so HashRouter lands on the expected route
                        window.location.replace(`${window.location.origin}${window.location.pathname}#/login`);
                        throw err;
                    });
            }

            try {
                const result = await refreshPromise;
                // If refresh did not produce a result, bail out safely
                if (!result || !result.accessToken) {
                    // Ensure we clear auth and redirect to login
                    await logoutCleanup();
                    window.location.replace(`${window.location.origin}${window.location.pathname}#/login`);
                    return Promise.reject(new Error('No access token after refresh'));
                }

                // mark original request as retried
                const accessToken = result?.accessToken;
                if (!accessToken) {
                    await logoutCleanup();
                    window.location.replace(`${window.location.origin}${window.location.pathname}#/login`);
                    return Promise.reject(new Error('No access token after refresh'));
                }

                originalRequest._retry = true;
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return API(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

/* ------------------------------------------------
   🚪 LOGOUT CLEANUP (Fully improved)
---------------------------------------------------*/
async function logoutCleanup() {
    try {
        // Clear storage
        storageManager.clear('local');
        storageManager.clear('session');

        // Clear caches
        if ("caches" in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
            console.log("🧹 PWA caches cleared");
        }

        // Unregister Service Workers
        if ("serviceWorker" in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
            console.log("🧹 Service workers unregistered");
        }
    } catch (err) {
        console.error("Logout cleanup error:", err);
    }
}

/* ------------------------------------------------
   📌 API HELPERS (Reusable)
---------------------------------------------------*/
export const fetchPosts = async () => {
    const { data } = await API.get("/posts");
    return data;
};

export const createPost = async (postData) => {
    const { data } = await API.post("/posts", postData);
    return data;
};
