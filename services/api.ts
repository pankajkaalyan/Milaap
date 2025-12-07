import axios from "axios";

/* ------------------------------------------------
   🚀 BASE API INSTANCE
---------------------------------------------------*/
export const API = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? ''
      : import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* ------------------------------------------------
   🔑 REQUEST INTERCEPTOR — Add Token
---------------------------------------------------*/
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------------------------
   🛑 RESPONSE INTERCEPTOR — Handle 401
---------------------------------------------------*/
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    console.log("⚠️ API Response Error Interceptor:", { status, error });
    if (status === 401) {
      console.warn("⚠️ 401 detected → Logging out user...");

      await logoutCleanup();

      // safest redirection inside interceptors
      window.location.replace("/login");
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
