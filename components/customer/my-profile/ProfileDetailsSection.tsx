import React from 'react';
import Card from '../../ui/Card';

interface ProfileDetailsSectionProps {
    title: string;
    children: React.ReactNode;
    isGrid?: boolean;
}

const ProfileDetailsSection: React.FC<ProfileDetailsSectionProps> = ({ title, children, isGrid = false }) => {
    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
            <div className={isGrid ? "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-300" : "space-y-2 text-gray-300"}>
                {children}
            </div>
        </Card>
    );
};

export default ProfileDetailsSection;
