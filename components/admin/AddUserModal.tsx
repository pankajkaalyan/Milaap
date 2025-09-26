import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { UserRole, AddUserFormData, ButtonVariant } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import Modal from '../ui/Modal';
import { useForm } from '../../hooks/useForm';
import { required, email, alphaOnly } from '../../utils/validators';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (name: string, email: string, role: UserRole) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const { t } = useAppContext();
  
  const { formData, errors, handleInputChange, setFieldValue, handleSubmit } = useForm<AddUserFormData>(
    { name: '', email: '', role: UserRole.CUSTOMER },
    {
      name: [required(t, t('register.name')), alphaOnly(t, t('register.name'))],
      email: [required(t, t('login.email')), email(t)],
    },
    (data) => {
      onAddUser(data.name, data.email, data.role);
    }
  );

  const footer = (
    <>
        <Button onClick={onClose} variant={ButtonVariant.SECONDARY} className="w-auto">Cancel</Button>
        <Button onClick={handleSubmit} type="submit" className="w-auto">{t('admin.users.add_user')}</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.users.add_user_title')} footer={footer}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            id="name"
            name="name"
            label={t('register.name')}
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="e.g., Arjun Menon"
          />
          <Input
            id="email"
            name="email"
            label={t('login.email')}
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="e.g., user@example.com"
          />
          <Dropdown
            id="role"
            label={t('admin.users.table.role')}
            value={formData.role}
            onChange={(value) => setFieldValue('role', value as UserRole)}
            options={[
              { value: UserRole.CUSTOMER, label: 'Customer' },
              { value: UserRole.ADMIN, label: 'Admin' }
            ]}
          />
        </form>
    </Modal>
  );
};

export default AddUserModal;