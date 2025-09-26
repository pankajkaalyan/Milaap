import React from 'react';
import { HoroscopeDetails } from '../../types';
import Card from './Card';
import MoonIcon from '../icons/MoonIcon';
import StarIcon from '../icons/StarIcon';
import UsersIcon from '../icons/UsersIcon';
import ShieldExclamationIcon from '../icons/ShieldExclamationIcon';
import { useAppContext } from '../../hooks/useAppContext';

interface HoroscopeCardProps {
  details: HoroscopeDetails;
  title?: string;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, highlight }) => (
    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 ${highlight ? 'text-amber-400' : 'text-pink-400'}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className={`font-semibold ${highlight ? 'text-amber-300' : 'text-white'}`}>{value}</p>
        </div>
    </div>
);


const HoroscopeCard: React.FC<HoroscopeCardProps> = ({ details, title }) => {
    const { t } = useAppContext();
    const hasMangalDosha = details.mangalDosha === 'Yes' || details.mangalDosha === 'Partial';
  
    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-4">{title || t('profile.horoscope_details')}</h2>
            <div className="space-y-3">
                <DetailItem
                    icon={<MoonIcon className="w-5 h-5" />}
                    label={t('profile.details.rashi')}
                    value={details.rashi || 'N/A'}
                />
                 <DetailItem
                    icon={<StarIcon className="w-5 h-5" />}
                    label={t('profile.details.nakshatra')}
                    value={details.nakshatra || 'N/A'}
                />
                 <DetailItem
                    icon={<UsersIcon className="w-5 h-5" />}
                    label={t('profile.details.gotra')}
                    value={details.gotra || 'N/A'}
                />
                 <DetailItem
                    icon={<ShieldExclamationIcon className="w-5 h-5" />}
                    label={t('profile.details.mangal_dosha')}
                    value={details.mangalDosha || 'N/A'}
                    highlight={hasMangalDosha}
                />
            </div>
        </Card>
  );
};

export default HoroscopeCard;
