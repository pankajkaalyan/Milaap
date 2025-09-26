import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import ProfileCard from '../../components/customer/ProfileCard';
import { mockUsers } from '../../data/mockUsers';
import { MembershipPlan } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
)

const Visitors: React.FC = () => {
    const { t, favourites, toggleFavourite, user } = useAppContext();
    const navigate = useNavigate();

    const isPremiumUser = user?.profile?.membership !== MembershipPlan.FREE;

    const visitorMatches = useMemo(() => {
        if (!user) return [];
        const blockedUserIds = user.profile?.blockedUsers || [];
        // Simulate visitors by taking a slice of mock users
        return mockUsers
            .slice(4, 12)
            .filter(u => u.id !== user.id && !blockedUserIds.includes(u.id.toString()));
    }, [user]);

    if (!isPremiumUser) {
        return (
             <div>
                <h1 className="text-3xl font-bold text-white mb-2">{t('visitors.title')}</h1>
                <p className="text-gray-300 mb-8">{t('visitors.intro')}</p>
                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 blur-md select-none pointer-events-none">
                       {visitorMatches.map(match => (
                            <ProfileCard 
                                key={match.id} 
                                match={match}
                                isFavourite={false}
                                onToggleFavourite={() => {}}
                            />
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                        <Card className="text-center max-w-lg">
                            <LockIcon />
                            <h2 className="text-2xl font-bold text-white mt-4">{t('visitors.unlock_prompt')}</h2>
                            <p className="text-gray-300 mt-2">{t('visitors.unlock_desc')}</p>
                            <Button onClick={() => navigate('/membership')} className="mt-6 w-auto">
                                {t('premium_modal.cta')}
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('visitors.title')}</h1>
            <p className="text-gray-300 mb-8">{t('visitors.intro')}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visitorMatches.map(match => (
                    <ProfileCard 
                        key={match.id} 
                        match={match}
                        isFavourite={favourites.some(fav => fav.id === match.id)}
                        onToggleFavourite={() => toggleFavourite(match)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Visitors;