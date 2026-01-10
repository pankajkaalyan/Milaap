import React from 'react';
import Input from '../../ui/Input';
import { RegisterFormData, FormErrors } from '../../../types';

interface Step1Props {
    formData: RegisterFormData;
    errors: FormErrors<RegisterFormData>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    t: (key: string) => string;
}

const Step1Account: React.FC<Step1Props> = ({
    formData,
    errors,
    handleInputChange,
    t
}) => {
    return (
        <div className="space-y-6">
            {/* Basic Details */}
            <Input
                name="name"
                label={t('register.name')}
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="e.g., Radha Sharma"
                required
            />

            <Input
                name="email"
                label={t('login.email')}
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="e.g., user@example.com"
                required
            />

            <Input
                name="password"
                label={t('login.password')}
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="********"
                required
            />

            {/* LinkedIn (Mandatory) */}
            <Input
                name="linkedin"
                label={t('register.linkedin')}
                type="url"
                value={formData.linkedin}
                onChange={handleInputChange}
                error={errors.linkedin}
                placeholder="https://www.linkedin.com/in/username"
                required
            />

            {/* Social Media (Any One) */}
            <Input
                name="socialMedia"
                label={t('register.socialMedia')}
                type="url"
                value={formData.socialMedia}
                onChange={handleInputChange}
                error={errors.socialMedia}
                placeholder="Facebook / Instagram / TikTok profile link"
                required
            />
        </div>
    );
};

export default Step1Account;
