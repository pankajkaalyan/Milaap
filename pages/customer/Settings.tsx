import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAppContext } from '../../hooks/useAppContext';
import { NotificationSettings, UserProfile } from '../../types';
import PrivacySettings from '../../components/customer/settings/PrivacySettings';
import NotificationSettingsComponent from '../../components/customer/settings/NotificationSettings';
import BlockedUsers from '../../components/customer/settings/BlockedUsers';
import AccountSettings from '../../components/customer/settings/AccountSettings';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import DeleteAccountModal from '../../components/customer/settings/DeleteAccountModal';


const Settings: React.FC = () => {
  const { t, user, updateUserProfile, addToast, deactivateAccount, deleteAccount } = useAppContext();

  const [formState, setFormState] = useState<Partial<UserProfile>>({});
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setFormState(JSON.parse(JSON.stringify(user.profile)));
    }
  }, [user]);

  const handleToggleChange = (category: keyof NotificationSettings, key: string, value: boolean) => {
    setFormState(prev => {
        if (!prev.notificationSettings) return prev;
        const newSettings = { ...prev };
        (newSettings.notificationSettings![category] as any)[key] = value;
        return newSettings;
    });
  };
  
  const handleDropdownChange = (key: keyof Pick<UserProfile, 'profileVisibility' | 'contactVisibility'>, value: string) => {
    setFormState(prev => ({
        ...prev,
        [key]: value
    }));
  };

  const handleSave = () => {
    updateUserProfile(formState as UserProfile);
    addToast(t('toast.settings.saved'), 'success');
  };

  const handleDeactivateConfirm = () => {
    setIsDeactivateModalOpen(false);
    deactivateAccount();
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    deleteAccount();
  };


  if (!formState.notificationSettings) {
    return null; // Or a loading state
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">{t('settings.title')}</h1>
          <p className="text-gray-300">{t('settings.subtitle')}</p>
        </div>
        
        <Card>
          <PrivacySettings 
              profileVisibility={formState.profileVisibility}
              contactVisibility={formState.contactVisibility}
              onDropdownChange={handleDropdownChange}
          />
        </Card>
        
        <Card>
          <NotificationSettingsComponent 
              settings={formState.notificationSettings}
              onToggleChange={handleToggleChange}
          />
        </Card>

        <Card>
          <BlockedUsers />
        </Card>

        <Card>
          <AccountSettings 
            onDeactivateClick={() => setIsDeactivateModalOpen(true)}
            onDeleteClick={() => setIsDeleteModalOpen(true)}
          />
        </Card>
        
        <div className="flex justify-end">
            <Button onClick={handleSave} className="w-auto">{t('settings.cta.save')}</Button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Account?"
        message={
          <>
            <p>Your profile will be hidden from the platform. You can reactivate your account at any time by simply logging back in.</p>
            <p className="mt-2">Are you sure you want to proceed?</p>
          </>
        }
        confirmButtonText="Deactivate"
      />
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default Settings;