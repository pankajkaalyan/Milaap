import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ProfileCard } from '../../components/customer/ProfileCard';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';

const Favourites: React.FC = () => {
    const { t, favourites, toggleFavourite, user } = useAppContext();

    const displayedFavourites = useMemo(() => {
        const blockedUserIds = user?.profile?.blockedUsers || [];
        return favourites.filter(fav => !blockedUserIds.includes(fav.id.toString()));
    }, [favourites, user]);

    return (
        <div>
            <PageHeader title={t('favourites.title')} subtitle={t('favourites.intro')} />
            
            {displayedFavourites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedFavourites.map((match, index) => (
                        <div key={match.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms`}}>
                            <ProfileCard 
                                match={match}
                                isFavourite={true}
                                onToggleFavourite={() => toggleFavourite(match)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-16 animate-fade-in">
                    <p className="text-gray-300">{t('favourites.no_results')}</p>
                </Card>
            )}
        </div>
    );
};

export default Favourites;