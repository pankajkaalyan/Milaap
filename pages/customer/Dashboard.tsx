import React, { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { mockUsers } from '../../data/mockUsers';
import ProfileCard from '../../components/customer/ProfileCard';
import AIMatchSuggestions from '../../components/customer/AIMatchSuggestions';
import { getDashboardDataAPI } from '@/services/api/dashboard';
import { Match } from '@/types/models';

const CustomerDashboard: React.FC = () => {
  const { user, t, trackEvent, favourites, toggleFavourite } = useAppContext();
  const [recommendedMatches, setRecommendedMatches] = useState<Match[]>([]);
  
  useEffect(() => {
    if (recommendedMatches.length === 0) {
      getDashboardDataAPI()
        .then(data => {
          // console.log('Dashboard data fetched:', data);
          setRecommendedMatches(data);
        })
        .catch(error => {
          console.error('Error fetching dashboard data:', error);
        });
    }
    // console.log('CustomerDashboard mounted for user:', user);
    trackEvent('view_dashboard', { userId: user?.id });
  }, [trackEvent, user?.id]);
  

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