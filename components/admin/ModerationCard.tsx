import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { ModerationCardIcon } from '../../types';

interface ModerationCardProps {
  title: string;
  count: number;
  linkTo: string;
  icon: ModerationCardIcon;
}

const VerificationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l4.5-4.5M12 2.944A12.02 12.02 0 0021 20.417l-4.5-4.5M12 2.944V21m8.618-13.016L12 12.586l-8.618-3.04" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;
const StoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;

const icons: Record<ModerationCardIcon, React.ReactNode> = {
    [ModerationCardIcon.VERIFICATION]: <VerificationIcon />,
    [ModerationCardIcon.REPORT]: <ReportIcon />,
    [ModerationCardIcon.STORY]: <StoryIcon />,
};

const colors: Record<ModerationCardIcon, string> = {
    [ModerationCardIcon.VERIFICATION]: 'text-blue-400',
    [ModerationCardIcon.REPORT]: 'text-red-400',
    [ModerationCardIcon.STORY]: 'text-yellow-400',
};

const ModerationCard: React.FC<ModerationCardProps> = ({ title, count, linkTo, icon }) => {
    const { t } = useAppContext();
    return (
        <div className="bg-black/20 backdrop-filter backdrop-blur-lg border border-white/10 rounded-xl p-5 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-400 font-semibold">{title}</h3>
                    <p className="text-4xl font-bold text-white mt-1">{count}</p>
                </div>
                <div className={`p-3 bg-white/10 rounded-lg ${colors[icon]}`}>
                    {icons[icon]}
                </div>
            </div>
            <Link to={linkTo} className="text-sm font-semibold text-amber-400 hover:text-amber-300 mt-4 inline-block">
                {t('admin.dashboard.view_queue')} &rarr;
            </Link>
        </div>
    );
};

export default ModerationCard;
