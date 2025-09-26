import React from 'react';
import { Match, ReportUserFormData, ButtonVariant } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import { useForm } from '../../hooks/useForm';
import { required } from '../../utils/validators';
import Modal from '../ui/Modal';

interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  user: Match;
}

const ReportUserModal: React.FC<ReportUserModalProps> = ({ isOpen, onClose, onSubmit, user }) => {
  const { t } = useAppContext();
  
  const { formData, errors, setFieldValue, handleInputChange, handleSubmit } = useForm<ReportUserFormData>(
    { reason: '', details: '' },
    { reason: required(t, t('report.reason')) },
    (data) => onSubmit(data.reason, data.details)
  );
  
  const footer = (
     <>
        <Button onClick={onClose} variant={ButtonVariant.SECONDARY} className="w-auto">Cancel</Button>
        <Button onClick={handleSubmit} type="submit" className="w-auto">{t('report.cta')}</Button>
     </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('report.title').replace('{name}', user.name)} footer={footer}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Dropdown
            id="reason"
            label={t('report.reason')}
            value={formData.reason}
            onChange={(value) => setFieldValue('reason', value)}
            options={[
                { value: 'fake', label: t('report.reason.fake') },
                { value: 'inappropriate', label: t('report.reason.inappropriate') },
                { value: 'scam', label: t('report.reason.scam') },
                { value: 'other', label: t('report.reason.other') },
            ]}
            placeholder={t('report.reason.placeholder')}
            error={errors.reason}
          />
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-1">
              {t('report.details')}
            </label>
            <textarea
              id="details"
              name="details"
              rows={4}
              value={formData.details}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 border-gray-600 focus:ring-amber-500"
              placeholder="Provide any additional information here..."
            />
          </div>
        </form>
    </Modal>
  );
};

export default ReportUserModal;