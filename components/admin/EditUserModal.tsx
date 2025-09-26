import React, { useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { UserRole, User, EditUserFormData, ButtonVariant } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import Modal from '../ui/Modal';
import { useForm } from '../../hooks/useForm';
import { required, alphaOnly } from '../../utils/validators';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (userId: string | number, userData: Partial<Pick<User, 'name' | 'role'>>) => void;
  user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onUpdateUser, user }) => {
  const { t } = useAppContext();
  
  const { formData, errors, handleInputChange, setFieldValue, handleSubmit, setFormData } = useForm<EditUserFormData>(
    { name: '', role: UserRole.CUSTOMER },
    { name: [required(t, t('register.name')), alphaOnly(t, t('register.name'))] },
    (data) => {
      if (user) {
        onUpdateUser(user.id, { name: data.name, role: data.role });
      }
    }
  );

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, role: user.role });
    }
  }, [user, setFormData]);

  if (!isOpen || !user) return null;
  
  const footer = (
     <>
        <Button onClick={onClose} variant={ButtonVariant.SECONDARY} className="w-auto">Cancel</Button>
        <Button onClick={handleSubmit} type="submit" className="w-auto">Save Changes</Button>
     </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.users.edit_user_title')} footer={footer}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            id="name"
            name="name"
            label={t('register.name')}
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <Input
            id="email"
            name="email"
            label={t('login.email')}
            type="email"
            value={user.email}
            disabled // Email is not editable
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

export default EditUserModal;