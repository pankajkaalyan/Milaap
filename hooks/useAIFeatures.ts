
import { useState, useCallback } from 'react';
import { User, AIMatchSuggestion, AIKundliReport } from '../types';
import { matchmakingService } from '../services/ai/matchmakingService';
import { mockUsers } from '../data/mockUsers';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;

export const useAIFeatures = (user: User | null, t: TFunction, addToast: AddToastFunction) => {
    const [aiSuggestions, setAiSuggestions] = useState<AIMatchSuggestion[]>([]);
    const [isFetchingAISuggestions, setIsFetchingAISuggestions] = useState(false);
    const [kundliReports, setKundliReports] = useState<Record<string, AIKundliReport | 'loading' | 'error'>>({});

    const fetchAISuggestions = useCallback(async () => {
        if (!user || !user.profile) return;
        if (aiSuggestions.length > 0) return;
        setIsFetchingAISuggestions(true);
        try {
            const oppositeGender = user.profile.gender === 'Female' ? 'Male' : 'Female';
            const potentialMatches = mockUsers.filter(u =>
                u.id !== user.id &&
                !user.profile?.blockedUsers?.includes(u.id.toString()) &&
                u.gender === oppositeGender
            ).slice(0, 10);

            const suggestions = await matchmakingService.getAISuggestions(user, potentialMatches);
            setAiSuggestions(suggestions);
        } catch (error) {
            console.error("Error fetching AI suggestions:", error);
            addToast(t('dashboard.ai_suggestions.error'), 'error');
        } finally {
            setIsFetchingAISuggestions(false);
        }
    }, [user, aiSuggestions, addToast, t]);

    const fetchAIKundliReport = useCallback(async (targetUserId: number) => {
        if (!user?.profile) return;
        const targetUser = mockUsers.find(u => u.id === targetUserId);
        if (!targetUser) return;
        const reportKey = `${user.id}-${targetUserId}`;
        if (kundliReports[reportKey] && kundliReports[reportKey] !== 'error') return;

        const { horoscope: currentUserHoroscope } = user.profile;
        const { horoscope: targetUserHoroscope } = targetUser;
        if (!currentUserHoroscope?.rashi || !targetUserHoroscope?.rashi) {
            addToast(t('kundli.error_no_details'), 'error');
            return;
        }

        setKundliReports(prev => ({ ...prev, [reportKey]: 'loading' }));
        try {
            const report = await matchmakingService.getAIKundliReport(currentUserHoroscope, targetUserHoroscope);
            setKundliReports(prev => ({ ...prev, [reportKey]: report }));
        } catch (error) {
            console.error("Error fetching AI Kundli report:", error);
            addToast(t('kundli.error'), 'error');
            setKundliReports(prev => ({ ...prev, [reportKey]: 'error' }));
        }
    }, [user, kundliReports, addToast, t]);

    return {
        aiSuggestions,
        isFetchingAISuggestions,
        fetchAISuggestions,
        kundliReports,
        fetchAIKundliReport,
    };
};
