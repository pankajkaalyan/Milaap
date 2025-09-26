import React, { useEffect, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { mockUsers } from '../../data/mockUsers';
import ProfileCard from '../../components/customer/ProfileCard';
import AIMatchSuggestions from '../../components/customer/AIMatchSuggestions';

const CustomerDashboard: React.FC = () => {
  const { user, t, trackEvent, favourites, toggleFavourite } = useAppContext();
  
  const recommendedMatches = useMemo(() => {
    if (!user) return [];
    const blockedUserIds = user.profile?.blockedUsers || [];
    return mockUsers
      .filter(u => 
        u.id !== user.id && 
        !blockedUserIds.includes(u.id.toString()) &&
        u.status !== 'deactivated'
      )
      .slice(0, 4);
  }, [user]);

  useEffect(() => {
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
                isFavourite={favourites.some(fav => fav.id === match.id)}
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