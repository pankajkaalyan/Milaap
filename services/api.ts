import axios from "axios";
import { showGlobalLoader, hideGlobalLoader } from "../utils/loaderBus";

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

        const token = localStorage.getItem("token");
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
                window.location.replace('/login');
                return Promise.reject(error);
            }

            // If a refresh is already in progress, wait for it
            if (!isRefreshing) {
                isRefreshing = true;
                const { refreshTokenAPI } = await import('./api/auth');
                refreshPromise = refreshTokenAPI()
                    .then(result => {
                        if (!result?.accessToken) throw new Error('No access token in refresh response');

                        localStorage.setItem('token', result.accessToken);
                        localStorage.setItem('refreshToken', result.refreshToken);
                        localStorage.setItem('expiresIn', String(result.expiresIn));
                        // Notify other parts of the app about the refresh
                        try {
                            window.dispatchEvent(new CustomEvent('token_refreshed', { detail: result }));
                        } catch (e) {
                            /* ignore */
                        }
                        isRefreshing = false;
                        return result;
                    })
                    .catch(async (err) => {
                        isRefreshing = false;
                        await logoutCleanup();
                        window.location.replace('/login');
                        throw err;
                    });
            }

            try {
                const result = await refreshPromise;
                // mark original request as retried
                originalRequest._retry = true;
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
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
        localStorage.clear();
        sessionStorage.clear();

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
