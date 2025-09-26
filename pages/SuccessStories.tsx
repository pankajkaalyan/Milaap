import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import SuccessStoryCard from '../components/customer/SuccessStoryCard';
import Button from '../components/ui/Button';
import SubmitStoryModal from '../components/customer/SubmitStoryModal';
import SEO from '../components/ui/SEO';
import PageHeader from '../components/ui/PageHeader';

const SuccessStories: React.FC = () => {
  const { t, user, allSuccessStories } = useAppContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const approvedStories = useMemo(() => {
    return allSuccessStories.filter(story => story.status === 'Approved');
  }, [allSuccessStories]);

  const handleShareStoryClick = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <SEO 
        title={`${t('nav.success_stories')} | Milaap`}
        description={t('success_stories.subtitle')}
      />
      <div className="text-center">
        <PageHeader 
            title={t('success_stories.title')}
            subtitle={t('success_stories.subtitle')}
        />
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button onClick={handleShareStoryClick} className="max-w-xs mx-auto">
            {t('success_stories.cta')}
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {approvedStories.map((story, index) => (
          <div key={story.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
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