import React, { useState } from 'react';
import { Match } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { useNavigate, Link } from 'react-router-dom';

interface AIProfileCardProps {
    match: Match;
    isFavourite: boolean;
    onToggleFavourite: () => void;
    reason: string;
}

const HeartIcon: React.FC<{ isFavourite: boolean }> = ({ isFavourite }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-300 ${isFavourite ? 'text-amber-500' : 'text-gray-400 hover:text-amber-400'}`} fill={isFavourite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const VerifiedBadge: React.FC = () => (
    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
        Verified
    </span>
);

const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-1 2.053a1 1 0 01-.633.633l-2.053 1a1 1 0 000 1.788l2.053 1a1 1 0 01.633.633l1 2.053a1 1 0 001.788 0l1-2.053a1 1 0 01.633-.633l2.053-1a1 1 0 000-1.788l-2.053-1a1 1 0 01-.633-.633l-1-2.053zM15 8a1 1 0 100-2 1 1 0 000 2zM5 8a1 1 0 100-2 1 1 0 000 2zM8 15a1 1 0 100-2 1 1 0 000 2zM12 15a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);

const AIProfileCard: React.FC<AIProfileCardProps> = ({ match, isFavourite, onToggleFavourite, reason }) => {
    const { t } = useAppContext();

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
    }

    const [imgError, setImgError] = useState(false);

    const showInitials = imgError || !match.photos?.length;
    const initials = match.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();



    return (
        <Link to={`/profile/${match.id}`} className="block bg-white/10 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col group cursor-pointer h-full">
            <div className="relative">
                <>
                    {!showInitials ? (
                        <img
                            src={match.photos[0]}
                            alt={match.name}
                            className="w-full h-48 object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-48 flex items-center justify-center bg-gray-700 text-white text-6xl font-bold">
                            {initials}
                        </div>
                    )}
                </>

                {/* <div className="absolute top-2 left-2 flex space-x-2">
                    <button
                        onClick={(e) => handleActionClick(e, onToggleFavourite)}
                        className="p-2 bg-black/30 rounded-full backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                        aria-label="Toggle favourite"
                    >
                        <HeartIcon isFavourite={isFavourite} />
                    </button>
                </div> */}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white flex items-center">
                    {match.name}, {match.age}
                    {match.verificationStatus === 'Verified' && <VerifiedBadge />}
                </h3>
                <p className="text-gray-300">{match.profession}</p>
                <p className="text-gray-400 text-sm mb-3">{match.location} &bull; {match.caste}</p>

                <div className="mt-auto pt-3 border-t border-white/10">
                    <p className="text-xs text-amber-300 font-semibold mb-1 flex items-center">
                        <SparkleIcon className="w-4 h-4 mr-1.5" />
                        {t('dashboard.ai_suggestions.reason_label')}
                    </p>
                    <p className="text-sm text-gray-200 italic">"{reason}"</p>
                </div>
            </div>
        </Link>
    );
};

export default AIProfileCard;