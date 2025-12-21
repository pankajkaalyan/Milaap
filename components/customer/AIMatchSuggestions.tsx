import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import AIProfileCard from './AIProfileCard';
import Spinner from '../ui/Spinner';
import SparkleIcon from '../icons/StarIcon';
import { Match } from '@/types/models';

interface AIMatchSuggestionsProps {
    recommendedMatches: Match[];
}

const AIMatchSuggestions: React.FC<AIMatchSuggestionsProps> = ({
    recommendedMatches,
}) => {
    const {
        t,
        aiSuggestions,
        isFetchingAISuggestions,
        fetchAISuggestions,
        favourites,
        toggleFavourite,
    } = useAppContext();
    
    const suggestedMatches = aiSuggestions
        .map(suggestion => {
            const match = recommendedMatches.find(
                m => m.id === suggestion.userId
            );

            return match
                ? { ...match, reason: suggestion.reason }
                : null;
        })
        .filter(Boolean);
    
    if (isFetchingAISuggestions) {
        return (
            <Card className="text-center py-16">
                <Spinner message={t('dashboard.ai_suggestions.loading')} />
            </Card>
        );
    }

    if (suggestedMatches.length === 0) {
        return (
            <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                    {t('dashboard.ai_suggestions.title')}
                </h2>

                <Card className="text-center py-10 bg-gradient-to-br from-amber-900/50 via-gray-900/50 to-orange-900/50">
                    <SparkleIcon className="w-12 h-12 mx-auto text-amber-400" />
                    <h3 className="text-2xl font-bold text-white mt-4">
                        {t('dashboard.ai_suggestions.cta_title')}
                    </h3>
                    <p className="text-gray-300 mt-2 max-w-lg mx-auto">
                        {t('dashboard.ai_suggestions.cta_desc')}
                    </p>
                    <Button
                        onClick={fetchAISuggestions}
                        className="max-w-xs mx-auto mt-6"
                    >
                        {t('dashboard.ai_suggestions.cta_button')}
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-4">
                {t('dashboard.ai_suggestions.title')}
            </h2>

            <div className="relative">
                <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
                    {suggestedMatches.map(match => (
                        <div
                            key={match!.id}
                            className="w-full sm:w-1/3 lg:w-1/4 flex-shrink-0"
                        >
                            <AIProfileCard
                                match={match!}
                                reason={match!.reason}
                                isFavourite={favourites.some(
                                    fav => fav.id === match!.id
                                )}
                                onToggleFavourite={() =>
                                    toggleFavourite(match!)
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIMatchSuggestions;
