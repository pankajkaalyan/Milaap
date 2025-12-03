import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import ProfileCard from '../../components/customer/ProfileCard';
import AIMatchSuggestions from '../../components/customer/AIMatchSuggestions';
import { getDashboardDataAPI } from '@/services/api/dashboard';
import { Match } from '@/types/models';

const CustomerDashboard: React.FC = () => {
    const { user, t, trackEvent, favourites, toggleFavourite } = useAppContext();
    const [recommendedMatches, setRecommendedMatches] = useState<Match[]>([]);

    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!user?.id) return;               // wait for user
        if (hasFetchedRef.current) return;   // block repeat calls

        hasFetchedRef.current = true;        // lock

        getDashboardDataAPI()
            .then(data => {
                setRecommendedMatches(data);
            })
            .catch(err =>
                console.error("Dashboard error:", err)
            );

        // tracking event (safe)
        trackEvent("view_dashboard", { userId: user.id });

    }, [user?.id]);


    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    {t('dashboard.welcome').replace('{name}', user?.name || '')}
                </h1>
                <p className="text-gray-300 mb-8">{t('dashboard.intro')}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedMatches.map(match => (
                        <ProfileCard
                            key={match.id}
                            match={match}
                            isFavourite={match.isFavourite || false}
                            onToggleFavourite={() => toggleFavourite(match)}
                        />
                    ))}
                </div>
            </div>

            <AIMatchSuggestions />

        </div>
    );
};

export default CustomerDashboard;