import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import ProfileCard from '../../components/customer/ProfileCard';
import { getMutualMatchesAPI } from '@/services/api/mutualMatches';
import { transformUserResponse } from '../../transform/transformMutualUser';
import { eventBus } from '@/utils/eventBus';
import { AppEventStatus } from '@/types/enums';
import { Match } from '@/types';

const MutualMatches: React.FC = () => {
    const { t, user, interests, favourites, toggleFavourite } = useAppContext();
    const [mutualMatchesData, setMutualMatchesData] = useState<ReturnType<typeof transformUserResponse>[]>([]);
    const hasFetchedMutualMatches = useRef(false);


    const updateFavouriteStatus = (data: { currentMatch: Match }) => {
        console.log('updateFavouriteStatus Mutual Matches called with data:', data);
        const targetUser = mutualMatchesData.find(match => match.id === data.currentMatch.id);
        if (targetUser) {
            targetUser.isFavourite = !targetUser.isFavourite;
            setMutualMatchesData([...mutualMatchesData]);
            console.log(`Updated favourite status for match ${targetUser.id} to ${targetUser.isFavourite}`);
        }
        console.log('Current mutual matches data:', mutualMatchesData);
    };

    useEffect(() => {
        eventBus.on(AppEventStatus.FAVOURITE, updateFavouriteStatus);

        if (!hasFetchedMutualMatches.current) {
            hasFetchedMutualMatches.current = true;

            getMutualMatchesAPI()
                .then(data => {
                    const transformedData = data.map(conn =>
                        transformUserResponse(conn, interests)
                    );
                    setMutualMatchesData(transformedData);
                })
                .catch(error => console.error(error));
        }

        return () => {
            eventBus.off(AppEventStatus.FAVOURITE, updateFavouriteStatus);
        };

    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white">{t('mutualMatches.title')}</h1>
                <p className="text-gray-300 mt-2 max-w-2xl mx-auto">{t('mutualMatches.subtitle')}</p>
            </div>

            {mutualMatchesData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {mutualMatchesData.map(match => (
                        <ProfileCard
                            key={match.id}
                            match={match}
                            isFavourite={match.isFavourite}
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
