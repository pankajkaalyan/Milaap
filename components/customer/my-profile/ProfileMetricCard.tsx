import React from 'react';
import Card from '../../ui/Card';

interface ProfileMetricCardProps {
    title: string;
    children: React.ReactNode;
}

const ProfileMetricCard: React.FC<ProfileMetricCardProps> = ({ title, children }) => {
    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            {children}
        </Card>
    );
};

export default ProfileMetricCard;
