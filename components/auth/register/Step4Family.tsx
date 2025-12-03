import React from 'react';
import Input from '../../ui/Input';
import Dropdown from '../../ui/Dropdown';
import { RegisterFormData, FormErrors } from '../../../types';

interface Step4Props {
    formData: RegisterFormData;
    errors: FormErrors<RegisterFormData>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDropdownChange: (id: keyof RegisterFormData, value: string) => void;
    t: (key: string) => string;
}

const Step4Family: React.FC<Step4Props> = ({ formData, errors, handleInputChange, handleDropdownChange, t }) => {
    return (
        <div className="space-y-6">
            <Input name="fatherName" label={t('profile.details.father_name')} type="text" value={formData.fatherName} onChange={handleInputChange} error={errors.fatherName} />
            <Input name="motherName" label={t('profile.details.mother_name')} type="text" value={formData.motherName} onChange={handleInputChange} error={errors.motherName} />
            <Input name="siblings" label={t('profile.details.siblings')} type="text" value={formData.siblings} onChange={handleInputChange} placeholder="e.g., 1 elder brother" />
            <Dropdown
                id="familyValues"
                label={t('profile.details.family_values')}
                value={formData.familyValues}
                onChange={(value) => handleDropdownChange('familyValues', value)}
                options={[{ value: 'Moderate', label: 'Moderate' }, { value: 'Traditional', label: 'Traditional' }, { value: 'Liberal', label: 'Liberal' }]}
            />
        </div>
    );
};

export default Step4Family;
