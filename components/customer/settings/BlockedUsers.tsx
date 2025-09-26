import React, { useMemo } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { mockUsers } from '../../../data/mockUsers';
import Button from '../../ui/Button';
import { ButtonVariant } from '../../../types';

const BlockedUsers: React.FC = () => {
    const { t, user, toggleBlockUser } = useAppContext();
    
    const blockedUsersFullProfile = useMemo(() => {
        if (!user?.profile?.blockedUsers) return [];
        return mockUsers.filter(u => user.profile!.blockedUsers!.includes(u.id.toString()));
    }, [user]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('settings.blocked.title')}</h2>
            <p className="text-gray-400 mb-6">{t('settings.blocked.desc')}</p>
            {blockedUsersFullProfile.length > 0 ? (
                <ul className="space-y-3">
                    {blockedUsersFullProfile.map(blockedUser => (
                        <li key={blockedUser.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <img src={blockedUser.photos?.[0] || `https://i.pravatar.cc/150?u=${blockedUser.id}`} alt={blockedUser.name} className="w-10 h-10 rounded-full object-cover" />
                                <span className="text-white font-semibold">{blockedUser.name}</span>
                            </div>
                            <Button onClick={() => toggleBlockUser(blockedUser.id as number)} variant={ButtonVariant.SECONDARY} className="w-auto !py-1 !px-3 !text-sm !bg-gray-600 hover:!bg-gray-500">{t('settings.blocked.unblock')}</Button>
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