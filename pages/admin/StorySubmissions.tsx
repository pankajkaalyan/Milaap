import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SuccessStoryStatus, BadgeVariant } from '../../types';
import BadgeWithTooltip from '../../components/ui/BadgeWithTooltip';
import { approveSuccessStoryAPI, fetchSuccessStoriesAPI, rejectSuccessStoryAPI } from '@/services/api/profile';
import ProfileLink from '@/components/ui/ProfileLink';

interface TabButtonProps {
    status: SuccessStoryStatus;
    label: string;
}

const StorySubmissions: React.FC = () => {
    const { t, allSuccessStories, approveStory, rejectStory, setAllSuccessStories } = useAppContext();
    const [filter, setFilter] = useState<SuccessStoryStatus>(SuccessStoryStatus.PENDING);
    const hasFetched = useRef(false);
    const filteredStories = useMemo(() => {
        return allSuccessStories.filter(s => s.status.toLocaleLowerCase() === filter.toLocaleLowerCase());
    }, [allSuccessStories, filter]);

    const getStatusBadge = (status?: SuccessStoryStatus) => {
        switch (status) {
            case SuccessStoryStatus.APPROVED: return <BadgeWithTooltip variant={BadgeVariant.SUCCESS} label={'Approved'} />;
            case SuccessStoryStatus.REJECTED: return <BadgeWithTooltip variant={BadgeVariant.DANGER} label={'Rejected'} />;
            default: return null;
        }
    }

    const rejectSelectedStory = (storyId: number) => {
        rejectSuccessStoryAPI(storyId)
            .then((response) => {
                // console.log('Rejected success story response:', response);
                // update local stories cache/state (if API doesn't return full list)
                setAllSuccessStories(prev =>
                    prev.map(s => (s.id === storyId ? { ...s, status: SuccessStoryStatus.REJECTED } : s))
                );
                rejectStory(storyId);
            })
            .catch((error) => {
                // console.warn('Error rejecting success story:', error);
            })


    }

    const approveSelectedStory = async (storyId: number) => {
        try {
            const response = await approveSuccessStoryAPI(storyId);
            // console.log("Approved success story response:", response);

            // Update local cached stories
            setAllSuccessStories(prev =>
                prev.map(s =>
                    s.id === storyId
                        ? { ...s, status: SuccessStoryStatus.APPROVED }
                        : s
                )
            );

            // If you also maintain a separate "approved" list
            approveStory(storyId);

        } catch (error) {
            // console.error("Error approving success story:", error);
        }
    };


    useEffect(() => {
        // Guard to ensure the API runs only once
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchSuccessStoriesAPI()
            .then((storyData) => {
                // console.log("Fetched success stories:", storyData);
                setAllSuccessStories(storyData);
            })
            .catch((error) => {
                // console.error("Error fetching success stories on mount:", error);
            });
    }, []);

    const TabButton: React.FC<TabButtonProps> = ({ status, label }) => (
        <button
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === status
                ? 'bg-pink-600 text-white'
                : 'text-gray-300 hover:bg-white/10'
                }`}
        >
            {label}
        </button>
    );

    const StoryImage = ({ story }) => {
        const [imgError, setImgError] = useState(false);

        const showInitials = imgError || !story?.imageUrl;

        const initials = story?.coupleNames
            ?.split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase();

        return (
            <>
                {!showInitials ? (
                    <img
                        src={story.imageUrl}
                        alt={story.coupleNames}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-48 rounded-t-lg bg-gray-300 flex items-center justify-center text-6xl font-bold text-gray-700">
                        {initials}
                    </div>
                )}
            </>
        );
    };


    return (
        <Card>
            <h1 className="text-3xl font-bold text-white mb-4">{t('admin.stories.title')}</h1>

            <div className="flex space-x-2 border-b border-white/10 mb-6">
                <TabButton status={SuccessStoryStatus.PENDING} label="Pending" />
                <TabButton status={SuccessStoryStatus.APPROVED} label="Approved" />
                <TabButton status={SuccessStoryStatus.REJECTED} label="Rejected" />
            </div>

            {filteredStories.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredStories.map(story => (
                        <div key={story.id} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden flex flex-col">
                            {/* <img src={story.imageUrl} alt={story.coupleNames} className="w-full h-48 object-cover" /> */}
                            <StoryImage story={story} />

                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <ProfileLink userId={story.submitterId} userName={story.coupleNames} className="text-amber-400 underline hover:text-amber-300 transition-colors">
                                            <h3 className="text-xl font-bold">
                                                {story.coupleNames}
                                            </h3>
                                        </ProfileLink>
                                        <p className="text-xs text-gray-400 mb-2">Wedding Date: {new Date(story.weddingDate).toLocaleDateString()}</p>
                                    </div>
                                    {story.status !== SuccessStoryStatus.PENDING && getStatusBadge(story.status)}
                                </div>
                                <p className="text-sm text-gray-300 flex-grow">"{story.story}"</p>

                                {story.status.toLocaleLowerCase() === SuccessStoryStatus.PENDING.toLocaleLowerCase() && (
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <Button onClick={() => rejectSelectedStory(story.id)} className="w-auto !py-1 !px-3 !text-sm !bg-gradient-to-r !from-red-600 !to-orange-600">
                                            {t('admin.actions.reject')}
                                        </Button>
                                        <Button onClick={() => approveSelectedStory(story.id)} className="w-auto !py-1 !px-3 !text-sm !bg-gradient-to-r !from-green-600 !to-teal-600">
                                            {t('admin.actions.approve')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-400">{t('admin.stories.no_stories')}</p>
                </div>
            )}
        </Card>
    );
};

export default StorySubmissions;