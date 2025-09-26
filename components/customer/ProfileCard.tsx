import React from 'react';
import { Match, InterestStatus } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { useNavigate, Link } from 'react-router-dom';

interface ProfileCardProps {
    match: Match;
    isFavourite: boolean;
    onToggleFavourite: () => void;
}

interface HeartIconProps {
  isFavourite: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({ isFavourite }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-6 w-6 transition-colors duration-300 ${isFavourite ? 'text-amber-500' : 'text-gray-400 hover:text-amber-400'}`} 
        fill={isFavourite ? 'currentColor' : 'none'}
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth="2"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const MessageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const VerifiedBadge: React.FC = () => (
    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
        Verified
    </span>
);

const ProfileCard: React.FC<ProfileCardProps> = ({ match, isFavourite, onToggleFavourite }) => {
    const { t, user: currentUser, interests, expressInterest, acceptInterest, declineInterest } = useAppContext();
    const navigate = useNavigate();

    const sentInterest = interests.find(i => i.senderId === currentUser?.id && i.receiverId === match.id);
    const receivedInterest = interests.find(i => i.senderId === match.id && i.receiverId === currentUser?.id);
    
    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault(); 
        e.stopPropagation();
        action();
    }
    
    const handleStartChat = () => {
        navigate(`/messages/${match.id}`);
    }

    const handleExpressInterest = () => {
        expressInterest(match.id);
    }
    
    const handleAcceptInterest = () => {
        acceptInterest(match.id);
    }

    const handleDeclineInterest = () => {
        declineInterest(match.id);
    }


    const getScoreColor = (score: number) => {
        if (score > 85) return 'bg-green-500/80 text-green-100';
        if (score > 70) return 'bg-yellow-500/80 text-yellow-100';
        return 'bg-orange-500/80 text-orange-100';
    }

    return (
        <Link to={`/profile/${match.id}`} className="block bg-white/10 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col group cursor-pointer">
            <div className="relative">
                <img src={match.photos && match.photos.length > 0 ? match.photos[0] : `https://picsum.photos/400/300?random=${match.id}`} alt={match.name} className="w-full h-48 object-cover"/>
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${getScoreColor(match.compatibilityScore)} backdrop-blur-sm`}>
                    {match.compatibilityScore}% {t('dashboard.compatibility_score')}
                </div>
                 <div className="absolute top-2 left-2 flex space-x-2">
                    <button 
                        onClick={(e) => handleActionClick(e, onToggleFavourite)}
                        className="p-2 bg-black/30 rounded-full backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                        aria-label="Toggle favourite"
                    >
                        <HeartIcon isFavourite={isFavourite} />
                    </button>
                     <button 
                        onClick={(e) => handleActionClick(e, handleStartChat)}
                        className="p-2 bg-black/30 rounded-full backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                        aria-label="Start chat"
                    >
                        <MessageIcon />
                    </button>
                 </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white flex items-center">
                    {match.name}, {match.age}
                    {match.verificationStatus === 'Verified' && <VerifiedBadge />}
                </h3>
                <p className="text-gray-300">{match.profession}</p>
                <p className="text-gray-400 text-sm mb-2">{match.location} &bull; {match.caste}</p>
                 <div className="mt-auto w-full">
                    {sentInterest ? (
                        <button disabled className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md cursor-not-allowed">
                            {t(`interests.status.${sentInterest.status.toLowerCase()}` as any)}
                        </button>
                    ) : receivedInterest?.status === InterestStatus.PENDING ? (
                         <div className="flex gap-2">
                            <button onClick={(e) => handleActionClick(e, handleDeclineInterest)} className="w-full text-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-red-600 to-orange-500 rounded-md group-hover:opacity-90 transition-opacity">
                                {t('interests.decline')}
                            </button>
                            <button onClick={(e) => handleActionClick(e, handleAcceptInterest)} className="w-full text-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-teal-500 rounded-md group-hover:opacity-90 transition-opacity">
                                {t('interests.accept')}
                            </button>
                        </div>
                    ) : (
                        <button onClick={(e) => handleActionClick(e, handleExpressInterest)} className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-md group-hover:opacity-90 transition-opacity">
                            {t('interests.express_interest')}
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProfileCard;