import React from 'react';
import Input from '../../ui/Input';
import Dropdown from '../../ui/Dropdown';
import { RegisterFormData, FormErrors } from '../../../types';

interface Step3Props {
    formData: RegisterFormData;
    errors: FormErrors<RegisterFormData>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDropdownChange: (id: keyof RegisterFormData, value: string) => void;
    t: (key: string) => string;
}

const Step3Family: React.FC<Step3Props> = ({ formData, errors, handleInputChange, handleDropdownChange, t }) => {
    return (
        <div className="space-y-6">
            <Input name="caste" label={t('register.caste')} type="text" value={formData.caste} onChange={handleInputChange} error={errors.caste} placeholder="e.g., Brahmin" />
            <Input name="subCaste" label={t('register.subcaste')} type="text" value={formData.subCaste} onChange={handleInputChange} placeholder="e.g., Gaur" />
            <Input name="gotra" label={t('profile.details.gotra')} type="text" value={formData.gotra} onChange={handleInputChange} placeholder="e.g., Kashyap" />
            <Dropdown
                id="mangalDosha"
                label={t('profile.details.mangal_dosha')}
                value={formData.mangalDosha}
                onChange={(value) => handleDropdownChange('mangalDosha', value)}
                options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }, { value: 'Partial', label: 'Partial' }]}
            />
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

export default Step3Family;
