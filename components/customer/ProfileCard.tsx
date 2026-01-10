import React, { useEffect, useState } from 'react';
import { Match, InterestStatus, InterestShown, AppEventStatus } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { useNavigate, Link } from 'react-router-dom';
import { eventBus } from "../../utils/eventBus";

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

const VerifiedBadge: React.FC = () => (
    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        Verified
    </span>
);

// ---------------- Reusable Internal Component ----------------
interface InternalCardProps extends ProfileCardProps {
    useLink?: boolean;
}

const InternalProfileCard: React.FC<InternalCardProps> = ({ match, isFavourite, onToggleFavourite, useLink = false }) => {
    const { t, expressInterest, acceptInterest, declineInterest } = useAppContext();
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const interestShown = match['interestShown'] as InterestShown | undefined;

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        (e.currentTarget as HTMLElement).blur();
        action();
    }

    const handleExpressInterest = () => { expressInterest(match.id, match.name); }
    const handleAcceptInterest = () => { acceptInterest(interestShown.interestRequestId, match.id, match.name); }
    const handleDeclineInterest = () => { declineInterest(interestShown.interestRequestId, match.id, match.name); }

    const getScoreColor = (score: number) => {
        if (score > 85) return 'bg-green-500/80 text-green-100';
        if (score > 70) return 'bg-yellow-500/80 text-yellow-100';
        return 'bg-orange-500/80 text-orange-100';
    }

    const updateStatusHandler = (data: { targetUserId: number; newStatus: InterestStatus }) => {
        if (data.targetUserId === match.id && interestShown) {
            interestShown.status = data.newStatus;
            if (data.newStatus === InterestStatus.PENDING) interestShown.isSent = true;
        }
    }

    const updateFavouriteStatus = (data: { currentMatch: Match }) => {
        if (data.currentMatch.id === match.id) match.isFavourite = !match.isFavourite;
    }

    useEffect(() => {
        eventBus.on(AppEventStatus.ACCEPTED, updateStatusHandler);
        eventBus.on(AppEventStatus.DECLINED, updateStatusHandler);
        eventBus.on(AppEventStatus.EXPRESS_INTEREST, updateStatusHandler);
        eventBus.on(AppEventStatus.FAVOURITE, updateFavouriteStatus);
        return () => {
            eventBus.off(AppEventStatus.ACCEPTED, updateStatusHandler);
            eventBus.off(AppEventStatus.DECLINED, updateStatusHandler);
            eventBus.off(AppEventStatus.EXPRESS_INTEREST, updateStatusHandler);
            eventBus.off(AppEventStatus.FAVOURITE, updateFavouriteStatus);
        }
    }, [match.id]);

    const getInitials = (fullName: string) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };
    const initials = getInitials(match.name);
    const showInitials = imgError || !match.photos?.[0];

    const CardContent = (
        <div className="block bg-white/10 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col group">
            <div className="relative">
                {!showInitials && match.photos?.[0] ? (
                    <img
                        src={match.photos[0]}
                        alt={match.name}
                        className="w-full h-48 object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-48 object-cover text-white flex items-center justify-center text-6xl font-bold">
                        {initials}
                    </div>
                )}

                <div className="absolute top-0 left-0 flex space-x-2">
                    <button
                        onClick={(e) => handleActionClick(e, onToggleFavourite)}
                        className="p-2 bg-black/30 rounded-full backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                        aria-label="Toggle favourite"
                    >
                        <HeartIcon isFavourite={isFavourite} />
                    </button>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white flex flex-col sm:flex-row sm:justify-between gap-2">
                    {(match.name || match.age) && (
                        <span className="text-white text-lg sm:text-xl">
                            {match.name}{match.age ? `, ${match.age}` : ''}
                        </span>
                    )}

                    <div className="flex flex-col items-start sm:items-end gap-2">
                        {match.compatibilityScore !== undefined && (
                            <div className={`px-3 py-1 text-xs font-semibold rounded-full ${getScoreColor(match.compatibilityScore)} backdrop-blur-sm whitespace-nowrap`}>
                                {match.compatibilityScore}% {t('dashboard.compatibility_score')}
                            </div>
                        )}
                        {match.verificationStatus?.toLowerCase() === 'verified' && (
                            <div className="flex items-center gap-1">
                                <VerifiedBadge />
                            </div>
                        )}
                    </div>
                </h3>

                {match.profession && <p className="text-gray-300">{match.profession}</p>}
                {(match.location || match.caste) && (
                    <p className="text-gray-400 text-sm mb-2">
                        {match.location}{match.location && match.caste ? ' • ' : ''}{match.caste}
                    </p>
                )}

                <div className="mt-auto w-full">
                    {interestShown?.isSent ? (
                        <button disabled className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md cursor-not-allowed">
                            {t(`interests.status.${interestShown?.status?.toLowerCase()}` as any)}
                        </button>
                    ) : interestShown?.status?.toLowerCase() === InterestStatus.PENDING.toLowerCase() ? (
                        <div className="flex gap-2">
                            <button onClick={(e) => handleActionClick(e, handleDeclineInterest)} className="w-full text-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-red-600 to-orange-500 rounded-md group-hover:opacity-90 transition-opacity">
                                {t('interests.decline')}
                            </button>
                            <button onClick={(e) => handleActionClick(e, handleAcceptInterest)} className="w-full text-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-teal-500 rounded-md group-hover:opacity-90 transition-opacity">
                                {t('interests.accept')}
                            </button>
                        </div>
                    ) : interestShown?.status?.toLowerCase() === InterestStatus.NONE.toLowerCase() ? (
                        <button onClick={(e) => handleActionClick(e, handleExpressInterest)} className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-md group-hover:opacity-90 transition-opacity">
                            {t('interests.express_interest')}
                        </button>
                    ) : (
                        interestShown?.status && (
                            <button disabled className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md cursor-not-allowed">
                                {t(`interests.status.${interestShown?.status?.toLowerCase()}` as any)}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );

    return useLink ? <Link to={`/profile/${match.id}`}>{CardContent}</Link> : CardContent;
};

// ---------------- Named Exports ----------------
const ProfileCard: React.FC<ProfileCardProps> = (props) => <InternalProfileCard {...props} useLink={false} />;
const MutualMatchProfileCard: React.FC<ProfileCardProps> = (props) => <InternalProfileCard {...props} useLink={true} />;

export { ProfileCard, MutualMatchProfileCard };
