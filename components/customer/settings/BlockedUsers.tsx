import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { mockUsers } from '../../../data/mockUsers';
import Button from '../../ui/Button';
import { AppEventStatus, ButtonVariant } from '../../../types';
import { getBlockedUsersAPI } from '@/services/api/profile';
import { eventBus } from '@/utils/eventBus';

const BlockedUsers: React.FC = () => {
    const { t, user, toggleBlockUser } = useAppContext();
    const [blockedUsersFullProfile, setBlockedUsersFullProfile] = useState([]);
    const [loading, setLoading] = useState(true);

    // const blockedUsersFullProfile = useMemo(() => {
    //     if (!user?.profile?.blockedUsers) return [];
    //     return mockUsers.filter(u => user.profile!.blockedUsers!.includes(u.id.toString()));
    // }, [user]);

    const loadBlockedUsers = async () => {
        try {
            setLoading(true);
            const data = await getBlockedUsersAPI();
            setBlockedUsersFullProfile(data || []);
        } catch (err) {
            // console.error("Failed to load blocked users", err);
        } finally {
            setLoading(false);
        }
    };


    const updateBlockedStatusHandler = (data: { targetUserId: number; isBlocked: boolean }) => {
        setBlockedUsersFullProfile(prev => prev.filter(user => user.id !== data.targetUserId));
    }

    const [imgError, setImgError] = useState(false)
    const showInitials = (blockedUser) => {
        return imgError || !blockedUser.photos?.[0];
    }
    const getInitials = (blockedUser) => {
        return blockedUser.name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    };

    useEffect(() => {
        loadBlockedUsers();
        eventBus.on(AppEventStatus.BLOCK_USER, updateBlockedStatusHandler);
        return () => {
            eventBus.off(AppEventStatus.BLOCK_USER, updateBlockedStatusHandler);
        }
    }, []);

    if (loading) return (<p className="text-gray-300">Loading...</p>);

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('settings.blocked.title')}</h2>
            <p className="text-gray-400 mb-6">{t('settings.blocked.desc')}</p>
            {blockedUsersFullProfile.length > 0 ? (
                <ul className="space-y-3">
                    {blockedUsersFullProfile.map(blockedUser => (
                        <li key={blockedUser.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {/* <img src={blockedUser.photos?.[0] || `https://i.pravatar.cc/150?u=${blockedUser.id}`} alt={blockedUser.name} className="w-10 h-10 rounded-full object-cover" /> */}
                                <>
                                    {!showInitials(blockedUser) ? (
                                        <img
                                            src={blockedUser.photos?.[0]}
                                            alt={blockedUser.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center text-xs font-bold">
                                            {getInitials(blockedUser)}
                                        </div>
                                    )}
                                </>

                                <span className="text-white font-semibold">{blockedUser.name}</span>
                            </div>
                            <Button onClick={() => toggleBlockUser(blockedUser.id as number, blockedUser.name, true)} variant={ButtonVariant.SECONDARY} className="w-auto !py-1 !px-3 !text-sm !bg-gray-600 hover:!bg-gray-500">{t('settings.blocked.unblock')}</Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">{t('settings.blocked.no_users')}</p>
            )}
        </div>
    );
};

export default BlockedUsers;