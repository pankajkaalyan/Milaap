import React from 'react';
import { User } from '../../../types';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

interface MyProfileHeaderProps {
    user: User;
    onEditClick: () => void;
    t: (key: string) => string;
}

const MyProfileHeader: React.FC<MyProfileHeaderProps> = ({ user, onEditClick, t }) => {
    return (
        <Card>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
                <img src={user.profile?.photos?.[0] || `https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=600`} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-amber-500" />
                <div className="text-center sm:text-left mt-4 sm:mt-0">
                    <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                    <p className="text-gray-300">{user.email}</p>
                    <Button onClick={onEditClick} className="w-auto px-4 py-2 mt-4 !text-sm">{t('profile.edit')}</Button>
                </div>
            </div>
        </Card>
    );
};

export default MyProfileHeader;