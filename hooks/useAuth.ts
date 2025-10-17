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

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email: string, role: UserRole, profile?: UserProfile) => {
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
                console.log('Fetched current user:', data);
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
            // mockUser = {
            //     id: 1,
            //     email,
            //     name,
            //     role: UserRole.CUSTOMER,
            //     createdAt: new Date().toISOString(),
            //     profile: {
            //         gender: 'female',
            //         dob: '1995-05-20',
            //         photos: ['https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=600'],
            //         horoscope: { nakshatra: "Rohini", rashi: "Vrishabha (Taurus)", gotra: "Kashyap", mangalDosha: "No" },
            //         verificationStatus: 'Not Verified',
            //         blockedUsers: [],
            //         notificationSettings: defaultNotificationSettings,
            //         membership: MembershipPlan.FREE,
            //         partnerPreferences: {
            //             ageRange: { min: 28, max: 35 },
            //             heightRange: { min: 175, max: 190 },
            //             castes: ['Brahmin', 'Kshatriya'],
            //             professions: ['Doctor', 'Engineer', 'Business Analyst'],
            //             mangalDosha: 'Any',
            //         },
            //         profileVisibility: 'all',
            //         contactVisibility: 'accepted',
            //         ...profile
            //     },
            // };
        }
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    const updateCurrentUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return {
        user,
        login,
        logout,
        updateCurrentUser,
    };
};