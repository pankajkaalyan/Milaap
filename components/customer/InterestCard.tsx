import React, { useEffect, useState } from 'react';
import { InterestStatus, InterestTab, BadgeVariant, UserInterest, AppEventStatus } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import BadgeWithTooltip from '../ui/BadgeWithTooltip';
import { eventBus } from '@/utils/eventBus';

interface InterestCardProps {
    interest: UserInterest;
    type: InterestTab;
    onAccept: () => void;
    onDecline: () => void;
    useLink?: boolean; // default false
}

const InterestCard: React.FC<InterestCardProps> = ({ interest, type, onAccept, onDecline, useLink = false }) => {
    const { t } = useAppContext();
    const [status, setStatus] = useState<InterestStatus>(interest.status);
    const [imgError, setImgError] = useState(false);

    // Sync local status if prop changes
    useEffect(() => {
        setStatus(interest.status);
    }, [interest.status]);

    // Subscribe to events and update local status
    useEffect(() => {
        const handler = (data: { targetUserId: number; newStatus: InterestStatus }) => {
            if (data.targetUserId === interest.profile.id) {
                setStatus(prev => (prev !== data.newStatus ? data.newStatus : prev));
            }
        };
        eventBus.on(AppEventStatus.ACCEPTED, handler);
        eventBus.on(AppEventStatus.DECLINED, handler);
        return () => {
            eventBus.off(AppEventStatus.ACCEPTED, handler);
            eventBus.off(AppEventStatus.DECLINED, handler);
        }
    }, [interest.profile.id]);

    const getStatusBadge = () => {
        switch (status) {
            case InterestStatus.ACCEPTED:
                return <BadgeWithTooltip variant={BadgeVariant.SUCCESS} label={t('interests.status.accepted')} />;
            case InterestStatus.DECLINED:
                return <BadgeWithTooltip variant={BadgeVariant.DANGER} label={t('interests.status.declined')} />;
            case InterestStatus.PENDING:
            default:
                return <BadgeWithTooltip variant={BadgeVariant.WARNING} label={t('interests.status.pending')} />;
        }
    };

    const getInitials = (fullName: string) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };
    const initials = getInitials(interest.profile.fullName);
    const showInitials = imgError || !interest.profile?.photos?.[0];

    const CardContent = (
        <div
            className={`bg-white/10 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 transition-all hover:bg-white/20 ${useLink ? 'cursor-pointer' : ''}`}
        >
            <div className="flex-shrink-0">
                {!showInitials ? (
                    <img
                        src={interest.profile.photos?.[0]}
                        alt={interest.profile.fullName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-amber-500"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full border-2 border-amber-500 bg-amber-200 text-amber-800 flex items-center justify-center text-xl font-bold">
                        {initials}
                    </div>
                )}
            </div>

            <div className="flex-1 text-center sm:text-left">
                <h3 className={`text-xl font-bold text-white ${useLink ? 'hover:underline' : ''}`}>
                    {interest.profile.fullName}, {interest.profile.age}
                </h3>
                <p className="text-gray-300 text-sm">{interest.profile.profession}</p>
                <p className="text-gray-400 text-xs">{interest.profile.city} &bull; {interest.profile.caste}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
                {type.toLowerCase() === InterestTab.RECEIVED.toLowerCase() && status.toLowerCase() === InterestStatus.PENDING.toLowerCase() && (
                    <>
                        <Button onClick={onDecline} className="w-full sm:w-auto !py-2 !px-4 !text-sm !bg-gradient-to-r !from-red-600 !to-orange-600">{t('interests.decline')}</Button>
                        <Button onClick={onAccept} className="w-full sm:w-auto !py-2 !px-4 !text-sm !bg-gradient-to-r !from-green-600 !to-teal-600">{t('interests.accept')}</Button>
                    </>
                )}
                {type.toLowerCase() === InterestTab.RECEIVED.toLowerCase() && status.toLowerCase() !== InterestStatus.PENDING.toLowerCase() && getStatusBadge()}
                {type.toLowerCase() === InterestTab.SENT.toLowerCase() && getStatusBadge()}
            </div>
        </div>
    );

    return useLink ? <Link to={`/profile/${interest.profile.id}`}>{CardContent}</Link> : CardContent;
};

export default InterestCard;
