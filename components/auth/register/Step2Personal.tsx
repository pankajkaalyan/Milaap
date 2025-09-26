import React from 'react';
import Input from '../../ui/Input';
import { RegisterFormData, FormErrors } from '../../../types';

interface Step2Props {
    formData: RegisterFormData;
    errors: FormErrors<RegisterFormData>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    t: (key: string) => string;
}

const Step2Personal: React.FC<Step2Props> = ({ formData, errors, handleInputChange, t }) => {
    return (
        <div className="space-y-6">
            <Input name="dateOfBirth" label={t('register.dob')} type="date" value={formData.dateOfBirth} onChange={handleInputChange} error={errors.dateOfBirth} max={new Date().toISOString().split('T')[0]} />
            <Input name="timeOfBirth" label={t('register.tob')} type="time" value={formData.timeOfBirth} onChange={handleInputChange} error={errors.timeOfBirth} />
            <Input name="height" label={t('register.height')} type="number" value={formData.height} onChange={handleInputChange} error={errors.height} placeholder="170" min="50" max="250" />
            <Input name="profession" label={t('register.profession')} type="text" value={formData.profession} onChange={handleInputChange} placeholder="e.g., Software Engineer" />
            <Input name="education" label={t('register.education')} type="text" value={formData.education} onChange={handleInputChange} placeholder="e.g., B.Tech in Computer Science" />
        </div>
    );
};

export default Step2Personal;