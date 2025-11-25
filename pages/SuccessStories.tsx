import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import SuccessStoryCard from '../components/customer/SuccessStoryCard';
import Button from '../components/ui/Button';
import SubmitStoryModal from '../components/customer/SubmitStoryModal';
import SEO from '../components/ui/SEO';
import PageHeader from '../components/ui/PageHeader';
import { fetchSuccessStoriesAPI } from '@/services/api/profile';
import { SuccessStoryStatus } from '@/types/enums';

const SuccessStories: React.FC = () => {
    const { t, user, allSuccessStories, setAllSuccessStories } = useAppContext();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const hasFetched = useRef(false);
    const approvedStories = useMemo(() => {
        return allSuccessStories.filter(story => story.status.toLocaleLowerCase() === SuccessStoryStatus.APPROVED.toLocaleLowerCase());
    }, [allSuccessStories]);

    const handleShareStoryClick = () => {
        if (user) {
            setIsModalOpen(true);
        } else {
            navigate('/login');
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
                // console.warn("Error fetching success stories on mount:", error);
            });
    }, []);

    return (
        <>
            <SEO
                title={`${t('nav.success_stories')} | Milaap`}
                description={t('successStories.subtitle')}
            />
            <div className="text-center">
                <PageHeader
                    title={t('successStories.title')}
                    subtitle={t('successStories.subtitle')}
                />
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Button onClick={handleShareStoryClick} className="max-w-xs mx-auto">
                        {t('successStories.cta')}
                    </Button>
                </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {approvedStories.map((story, index) => (
                    <div key={story.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <SuccessStoryCard story={story} />
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <SubmitStoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default SuccessStories;