import { useState, useEffect } from 'react';
import { User, UserRole, UserProfile, MembershipPlan, AdminRole, NotificationSettings } from '../types';
import { fetchCurrentUserAPI } from '@/services/api/profile';

const defaultNotificationSettings: NotificationSettings = {
    push: { newMatch: true, newMessage: true, profileView: false },
    email: { newMatch: true, newMessage: false, weeklyDigest: true },
    sms: { newMessage: false },
};

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        // console.log('Stored user in useAuth:', storedUser);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = (email: string, role: UserRole, profile?: UserProfile, token?: string) => {
        let mockUser: User;
        if (role === UserRole.ADMIN) {
            const isAdminSuper = email === 'admin@example.com';
            mockUser = {
                id: isAdminSuper ? 'admin-super-1' : 'admin-mod-1',
                email,
                name: isAdminSuper ? 'Super Admin' : 'Moderator',
                role: UserRole.ADMIN,
                adminRole: isAdminSuper ? AdminRole.SUPER_ADMIN : AdminRole.MODERATOR,
                createdAt: new Date().toISOString(),
            }
        } else {
            let name = 'Radha Sharma';
            if (email.includes('google.user')) {
                name = 'Google User';
            } else if (email.includes('facebook.user')) {
                name = 'Facebook User';
            }

            fetchCurrentUserAPI().then(data => {
                // console.log('Fetched current user:', data);
                let mockUser = {
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    role: UserRole.CUSTOMER,
                    createdAt: data.createdAt,
                    profile: data.profile,
                };
                localStorage.setItem('user', JSON.stringify(mockUser));
                setUser(mockUser);
            }).catch(err => {
                console.error('Error fetching current user:', err);
            });
        }
        localStorage.setItem('user', JSON.stringify(mockUser));
        if (token) {
            setToken(token);
        }
        setUser(mockUser);
    };

    const logout = async () => {
        setToken(null);
        localStorage.clear();
        sessionStorage.clear();

        // 2️⃣ Delete all service worker caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
            console.log("✅ All PWA caches cleared");
        }

        // 3️⃣ Unregister service workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
            console.log("✅ Service workers unregistered");
        }
        // 4️⃣ Finally, reload from the network
        window.location.reload();
        setUser(null);
    };

    const updateCurrentUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return {
        token,
        user,
        login,
        logout,
        updateCurrentUser,
    };
};