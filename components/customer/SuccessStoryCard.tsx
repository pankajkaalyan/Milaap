import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SuccessStory } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../ui/Card';

interface SuccessStoryCardProps {
  story: SuccessStory;
}

const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({ story }) => {
  const { t } = useAppContext();
  const shortStory = story.story.length > 150 ? `${story.story.substring(0, 150)}...` : story.story;
  
  const [imgError, setImgError] = useState(false);
  const showInitials = imgError || !story?.imageUrl;

  const initials = story?.coupleNames
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300">
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

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-white">{story.coupleNames}</h3>
        <p className="text-sm text-gray-400 mb-4">
          Married on {new Date(story.weddingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <blockquote className="text-gray-300 italic border-l-4 border-amber-500 pl-4 my-4 flex-grow">
          "{shortStory}"
        </blockquote>
        <div className="mt-auto">
          <Link to={`/success-stories/${story.id}`} className="font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer">
            {t('successStories.read_more')} &rarr;
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default SuccessStoryCard;