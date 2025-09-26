
import { useState, useEffect } from 'react';
import { User, Match } from '../../types';
import { interactionService } from '../../services/api/interactionService';
import { mockUsers } from '../../data/mockUsers';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;

export const useFavourites = (user: User | null, t: TFunction, addToast: AddToastFunction) => {
    const [favourites, setFavourites] = useState<Match[]>([]);

    useEffect(() => {
        if (user) {
            const fetchFavourites = async () => {
                try {
                    const favData = await interactionService.getFavourites(user.id as number);
                    const favMatches = mockUsers.filter(u => favData.includes(u.id as number));
                    setFavourites(favMatches);
                } catch (error) {
                    console.error("Failed to fetch favourites:", error);
                    addToast("Could not load your favourites.", 'error');
                }
            };
            fetchFavourites();
        }
    }, [user, addToast]);

    const toggleFavourite = async (match: Match) => {
        if (!user) return;
        const newFavouriteIds = await interactionService.toggleFavourite(user.id as number, match.id as number);
        const newFavourites = mockUsers.filter(u => newFavouriteIds.includes(u.id as number));
        setFavourites(newFavourites);

        const isNowFavourite = newFavouriteIds.includes(match.id as number);
        addToast(
            isNowFavourite ? t('toasts.favourite.added', { name: match.name }) : t('toasts.favourite.removed', { name: match.name }),
            isNowFavourite ? 'success' : 'info'
        );
    };

    return { favourites, toggleFavourite };
};
