import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Card from '../components/ui/Card';
import NotFound from './NotFound';
import SEO from '../components/ui/SEO';

const SuccessStoryDetail: React.FC = () => {
    const { storyId } = useParams<{ storyId: string }>();
    const { allSuccessStories } = useAppContext();

    const story = allSuccessStories.find(s => s.id.toString() === storyId);

    if (!story) {
        return <NotFound />;
    }

    const shortStory = story.story.length > 150 ? `${story.story.substring(0, 150)}...` : story.story;

    return (
        <>
            <SEO 
                title={`${story.coupleNames}'s Story | Milaap Success Stories`}
                description={shortStory}
            />
            <div className="max-w-4xl mx-auto">
                <Card>
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">{story.coupleNames}</h1>
                        <p className="text-gray-400">
                            Married on {new Date(story.weddingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <img
                        src={story.imageUrl}
                        alt={story.coupleNames}
                        className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8"
                    />

                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                        <p>{story.story}</p>
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            to="/success-stories"
                            className="font-semibold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
                        >
                            &larr; Back to All Stories
                        </Link>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default SuccessStoryDetail;