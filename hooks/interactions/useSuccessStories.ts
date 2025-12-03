
import { useState, useEffect } from 'react';
import { SuccessStory } from '../../types';
import { storyService } from '../../services/api/storyService';
import { submitSuccessStoryAPI } from '@/services/api/profile';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;

export const useSuccessStories = (t: TFunction, addToast: AddToastFunction) => {
    const [allSuccessStories, setAllSuccessStories] = useState<SuccessStory[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const storyData = await storyService.getSuccessStories();
                setAllSuccessStories(storyData);
            } catch (error) {
                // console.error("Failed to fetch success stories:", error);
                addToast("Could not load success stories.", 'error');
            }
        };
        // fetchStories();
    }, []);
    
    const submitSuccessStory = async (storyData: Omit<SuccessStory, 'id' | 'imageUrl' | 'status'> & { couplePhoto?: File }) => {
        const newStoryData: Omit<SuccessStory, 'id' | 'status'> = {
            coupleNames: storyData.coupleNames,
            weddingDate: storyData.weddingDate,
            story: storyData.story,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
        };
        // const newStory = await storyService.submitSuccessStory(newStoryData);
        const newStory = await submitSuccessStoryAPI({ ...newStoryData, couplePhoto: storyData.couplePhoto } as any );
        setAllSuccessStories(prev => [newStory, ...prev]);
        addToast(t('toasts.story.submitted'), 'success');
    };
    
    return { allSuccessStories, setAllSuccessStories, submitSuccessStory };
};
