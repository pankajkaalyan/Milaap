import { useState, useEffect, useRef } from 'react';
import { User, UserRole, UserProfile, MembershipPlan, AdminRole, NotificationSettings, AppEventStatus } from '../types';
import { fetchCurrentUserAPI } from '@/services/api/profile';
import { eventBus } from '@/utils/eventBus';
import { refreshTokenAPI } from '@/services/api/auth';

const defaultNotificationSettings: NotificationSettings = {
    push: { newMatch: true, newMessage: true, profileView: false },
    email: { newMatch: true, newMessage: false, weeklyDigest: true },
    sms: { newMessage: false },
};

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [expiresIn, setExpiresIn] = useState<number | null>(null);
    const refreshTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const storedExpiry = localStorage.getItem("expiresIn");
        console.log("⏳ Loaded from localStorage", { storedUser, storedToken, storedExpiry });
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);
        if (storedExpiry) setExpiresIn(Number(storedExpiry));
    }, [token]);

    // ---------------------------------------------------
    // Auto-refresh token BEFORE expiration
    // ---------------------------------------------------
    useEffect(() => {
        console.log("⏰ Setting up token refresh timer", { token, expiresIn });
        if (!token || !expiresIn) return;

        // Refresh 10 minutes before expiry
        const refreshBefore = (expiresIn - 600) * 1000;
        console.log(`⏰ Scheduling token refresh in ${refreshBefore / 1000 / 60} minutes`);
        console.log("⏰ refreshBefore :", refreshBefore);
        if (refreshTimer.current) clearTimeout(refreshTimer.current);
        refreshTimer.current = setTimeout(async () => {
            console.log("🔄 Refreshing token... Api will call");
            const result = await refreshTokenAPI();
            console.log("🔄 Token refresh result:", result);
            if (!result.accessToken) {
                console.warn("Token refresh failed → logging out");
                logout();
                return;
            }

            setToken(result.accessToken);
            setExpiresIn(result.expiresIn);

            localStorage.setItem("token", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);
            localStorage.setItem("expiresIn", String(result.expiresIn));
            console.log("🔄 Token refreshed automatically");

        }, refreshBefore);

        return () => {
            if (refreshTimer.current) clearTimeout(refreshTimer.current);
        };

    }, [token, expiresIn]);


    // ---------------------------------------------------
    // LOGIN
    // ---------------------------------------------------
    const login = async (email: string, role: UserRole, profile?: UserProfile, userToken?: string) => {
        // logout(); // Clear previous state
        // if (role === UserRole.ADMIN) {
        //     const isSuper = email === "admin@example.com";
        //     const mockUser: User = {
        //         id: isSuper ? "admin-super-1" : "admin-mod-1",
        //         email,
        //         name: isSuper ? "Super Admin" : "Moderator",
        //         role: UserRole.ADMIN,
        //         adminRole: isSuper ? AdminRole.SUPER_ADMIN : AdminRole.MODERATOR,
        //         createdAt: new Date().toISOString(),
        //     };

        //     setUser(mockUser);
        //     localStorage.setItem("user", JSON.stringify(mockUser));
        //     return;
        // }

        // CUSTOMER LOGIN → fetch user profile
        try {
            const data = await fetchCurrentUserAPI();

            const newUser: User = {
                id: data.id,
                email: data.email,
                name: data.name,
                role: data.role === UserRole.ROLE_ADMIN ? UserRole.ADMIN : UserRole.CUSTOMER,
                adminRole: data.role === UserRole.ROLE_ADMIN ? AdminRole.SUPER_ADMIN : undefined,
                profile: data.profile,
                createdAt: data.createdAt,
                interestShownList: data.interestShownList,
            };

            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));

            if (userToken) {
                setToken(userToken);
                localStorage.setItem("token", userToken);
            }

            if (data.tokenExpiresIn) {
                setExpiresIn(data.tokenExpiresIn);
                localStorage.setItem("expiresIn", String(data.tokenExpiresIn));
            }

            eventBus.emit(AppEventStatus.LOGIN_SUCCESS, {role: newUser.role, userId: newUser.id});

        } catch (err) {
            console.error("❌ Login failed:", err);
        }
    };

    // ---------------------------------------------------
    // LOGOUT (Clears User, Token, PWA Cache, Service Workers, Storage)
    // ---------------------------------------------------
    const logout = async () => {
        try {
            // 1️⃣ Clear React State
            setUser(null);
            setToken(null);
            setExpiresIn(null);

            // 2️⃣ Clear Local & Session Storage
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("expiresIn");
            sessionStorage.clear();

            // 3️⃣ Emit logout event
            eventBus.emit(AppEventStatus.LOGOUT);

            // 4️⃣ Clear PWA caches
            if ("caches" in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(cache => caches.delete(cache)));
                console.log("✅ All PWA caches cleared");
            }

            // 5️⃣ Unregister all service workers
            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                }
                console.log("✅ All service workers unregistered");
            }

            // 6️⃣ Small delay to ensure cleanup is complete
            setTimeout(() => {
                window.location.reload();
            }, 200);

        } catch (error) {
            console.error("❌ Error during logout cleanup:", error);
            window.location.reload();
        }
    };


    // const logout = async () => {
    //     setToken(null);
    //     localStorage.clear();
    //     sessionStorage.clear();

    //     // 2️⃣ Delete all service worker caches
    //     if ('caches' in window) {
    //         const cacheNames = await caches.keys();
    //         await Promise.all(cacheNames.map((name) => caches.delete(name)));
    //         console.log("✅ All PWA caches cleared");
    //     }

    //     // 3️⃣ Unregister service workers
    //     if ('serviceWorker' in navigator) {
    //         const registrations = await navigator.serviceWorker.getRegistrations();
    //         for (const registration of registrations) {
    //             await registration.unregister();
    //         }
    //         console.log("✅ Service workers unregistered");
    //     }
    //     // 4️⃣ Finally, reload from the network
    //     window.location.reload();
    //     setUser(null);
    // };

    const updateCurrentUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return {
        user,
        token,
        expiresIn,
        login,
        logout,
        updateCurrentUser,
    };
};