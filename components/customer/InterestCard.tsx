import React from 'react';
import { InterestStatus, InterestTab, BadgeVariant, UserInterest } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface InterestCardProps {
    interest: UserInterest;
    type: InterestTab;
    onAccept: () => void;
    onDecline: () => void;
}

const InterestCard: React.FC<InterestCardProps> = ({ interest, type, onAccept, onDecline }) => {
    const { t } = useAppContext();
    const { status } = interest;

    const getStatusBadge = () => {
        switch (status) {
            case InterestStatus.ACCEPTED:
                return <Badge variant={BadgeVariant.SUCCESS}>{t('interests.status.accepted')}</Badge>;
            case InterestStatus.DECLINED:
                 return <Badge variant={BadgeVariant.DANGER}>{t('interests.status.declined')}</Badge>;
            case InterestStatus.PENDING:
            default:
                 return <Badge variant={BadgeVariant.WARNING}>{t('interests.status.pending')}</Badge>;
        }
    };
    
    return (
        <div className="bg-white/10 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 transition-all hover:bg-white/20">
            <Link to={`/profile/${interest.profile.id}`}>
                 <img src={interest.profile.photos || `https://picsum.photos/400/300?random=${interest.profile.id}`} alt={interest.profile.fullName} className="w-20 h-20 rounded-full object-cover border-2 border-amber-500"/>
            </Link>
           
            <div className="flex-1 text-center sm:text-left">
                <Link to={`/profile/${interest.profile.id}`} className="hover:underline">
                    <h3 className="text-xl font-bold text-white">{interest.profile.fullName}, {interest.profile.age}</h3>
                </Link>
                <p className="text-gray-300 text-sm">{interest.profile.profession}</p>
                <p className="text-gray-400 text-xs">{interest.profile.city} &bull; {interest.profile.caste}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
                {type.toLocaleLowerCase() === InterestTab.RECEIVED.toLocaleLowerCase() && status.toLocaleLowerCase() === InterestStatus.PENDING.toLocaleLowerCase() && (
                    <>
                        <Button onClick={onDecline} className="w-full sm:w-auto !py-2 !px-4 !text-sm !bg-gradient-to-r !from-red-600 !to-orange-600">{t('interests.decline')}</Button>
                        <Button onClick={onAccept} className="w-full sm:w-auto !py-2 !px-4 !text-sm !bg-gradient-to-r !from-green-600 !to-teal-600">{t('interests.accept')}</Button>
                    </>
                )}
                 {type.toLocaleLowerCase() === InterestTab.RECEIVED.toLocaleLowerCase() && status.toLocaleLowerCase() !== InterestStatus.PENDING.toLocaleLowerCase() && getStatusBadge()}
                 {type.toLocaleLowerCase() === InterestTab.SENT.toLocaleLowerCase() && getStatusBadge()}
            </div>
        </div>
    );
};

export default InterestCard;