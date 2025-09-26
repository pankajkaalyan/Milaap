import React from 'react';
import { Match, Interest, InterestStatus, InterestTab, BadgeVariant } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface InterestCardProps {
    user: Match;
    interest: Interest;
    type: InterestTab;
    onAccept: () => void;
    onDecline: () => void;
}

const InterestCard: React.FC<InterestCardProps> = ({ user, interest, type, onAccept, onDecline }) => {
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
            <Link to={`/profile/${user.id}`}>
                 <img src={user.photos?.[0] || `https://picsum.photos/400/300?random=${user.id}`} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-amber-500"/>
            </Link>
           
            <div className="flex-1 text-center sm:text-left">
                <Link to={`/profile/${user.id}`} className="hover:underline">
                    <h3 className="text-xl font-bold text-white">{user.name}, {user.age}</h3>
                </Link>
                <p className="text-gray-300 text-sm">{user.profession}</p>
                <p className="text-gray-400 text-xs">{user.location} &bull; {user.caste}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
                {type === InterestTab.RECEIVED && status === InterestStatus.PENDING && (
                    <>
                        <Button onClick={onDecline} className="w-full sm:w-auto !py-2 !px-4 !text-sm !bg-gradient-to-r !from-red-600 !to-orange-600">{t('interests.decline')}</Button>
                        <Button onClick={onAccept} className="w-full sm:w-auto !py-2 !px-4 !text-sm !bg-gradient-to-r !from-green-600 !to-teal-600">{t('interests.accept')}</Button>
                    </>
                )}
                 {type === InterestTab.RECEIVED && status !== InterestStatus.PENDING && getStatusBadge()}
                 {type === InterestTab.SENT && getStatusBadge()}
            </div>
        </div>
    );
};

export default InterestCard;