import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SuccessStory, SuccessStoryStatus, BadgeVariant } from '../../types';
import Badge from '../../components/ui/Badge';

interface TabButtonProps {
  status: SuccessStoryStatus;
  label: string;
}

const StorySubmissions: React.FC = () => {
    const { t, allSuccessStories, approveStory, rejectStory } = useAppContext();
    const [filter, setFilter] = useState<SuccessStoryStatus>(SuccessStoryStatus.PENDING);
    
    const filteredStories = useMemo(() => {
        return allSuccessStories.filter(s => s.status === filter);
    }, [allSuccessStories, filter]);

    const getStatusBadge = (status?: SuccessStoryStatus) => {
        switch(status) {
            case SuccessStoryStatus.APPROVED: return <Badge variant={BadgeVariant.SUCCESS}>Approved</Badge>;
            case SuccessStoryStatus.REJECTED: return <Badge variant={BadgeVariant.DANGER}>Rejected</Badge>;
            default: return null;
        }
    }

    const TabButton: React.FC<TabButtonProps> = ({ status, label }) => (
        <button
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                filter === status
                ? 'bg-pink-600 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
        >
            {label}
        </button>
    );

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
                            <img src={story.imageUrl} alt={story.coupleNames} className="w-full h-48 object-cover" />
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{story.coupleNames}</h3>
                                        <p className="text-xs text-gray-400 mb-2">Wedding Date: {new Date(story.weddingDate).toLocaleDateString()}</p>
                                    </div>
                                    {story.status !== SuccessStoryStatus.PENDING && getStatusBadge(story.status)}
                                </div>
                                <p className="text-sm text-gray-300 flex-grow">"{story.story}"</p>
                                
                                {story.status === SuccessStoryStatus.PENDING && (
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <Button onClick={() => rejectStory(story.id)} className="w-auto !py-1 !px-3 !text-sm !bg-gradient-to-r !from-red-600 !to-orange-600">
                                            {t('admin.actions.reject')}
                                        </Button>
                                        <Button onClick={() => approveStory(story.id)} className="w-auto !py-1 !px-3 !text-sm !bg-gradient-to-r !from-green-600 !to-teal-600">
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