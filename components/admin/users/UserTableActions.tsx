import React from 'react';
import Button from '../../ui/Button';
import { ButtonVariant } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';

interface UserTableActionsProps {
  onImportClick: () => void;
  onExportClick: () => void;
  onAddUserClick: () => void;
}

const UserTableActions: React.FC<UserTableActionsProps> = ({ onImportClick, onExportClick, onAddUserClick }) => {
  const { t } = useAppContext();

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
      <h1 className="text-3xl font-bold text-white">{t('admin.users.title')}</h1>
      <div className="flex gap-2">
        {/* <Button onClick={onImportClick} variant={ButtonVariant.SECONDARY} className="w-auto !py-2 !px-4 !text-sm">{t('admin.users.import')}</Button> */}
        <Button onClick={onExportClick} variant={ButtonVariant.SECONDARY} className="w-auto !py-2 !px-4 !text-sm">{t('admin.users.export')}</Button>
        {/* <Button onClick={onAddUserClick} variant={ButtonVariant.PRIMARY} className="w-auto !py-2 !px-4 !text-sm">{t('admin.users.add_user')}</Button> */}
      </div>
    </div>
  );
};

export default UserTableActions;