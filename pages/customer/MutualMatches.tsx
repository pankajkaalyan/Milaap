import React, { useEffect, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import { mockUsers } from '../../data/mockUsers';
import ProfileCard from '../../components/customer/ProfileCard';
import { InterestStatus } from '../../types';
import { getMutualMatchesAPI } from '@/services/api/mutualMatches';

const MutualMatches: React.FC = () => {
    const { t, user, interests, favourites, toggleFavourite } = useAppContext();

    const mutualMatches = useMemo(() => {
        if (!user) return [];

        const mutualMatchUserIds = new Set<number>();

        interests.forEach(interest => {
            if (interest.status === InterestStatus.ACCEPTED) {
                if (interest.senderId === user.id) {
                    mutualMatchUserIds.add(interest.recipientId);
                }
                if (interest.recipientId === user.id) {
                    mutualMatchUserIds.add(interest.senderId);
                }
            }
        });

        return mockUsers.filter(u => mutualMatchUserIds.has(u.id as number));

    }, [interests, user]);

    useEffect(() => {
        getMutualMatchesAPI()
            .then(data => {
                console.log('Mutual matches data fetched successfully:', data);
            })
            .catch(error => {
                console.error('Error fetching mutual matches data:', error);
            });
        console.log('MutualMatches mounted for user:', user);
    }, [user]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white">{t('mutualMatches.title')}</h1>
                <p className="text-gray-300 mt-2 max-w-2xl mx-auto">{t('mutualMatches.subtitle')}</p>
            </div>

            {mutualMatches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {mutualMatches.map(match => (
                        <ProfileCard
                            key={match.id}
                            match={match}
                            isFavourite={favourites.some(fav => fav.id === match.id)}
                            onToggleFavourite={() => toggleFavourite(match)}
                        />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-16">
                    <p className="text-gray-300">{t('mutualMatches.no_results')}</p>
                </Card>
            )}
        </div>
    );
};

export default MutualMatches;
