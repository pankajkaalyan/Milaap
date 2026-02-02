import React, { useRef } from 'react';
import Input from '../../ui/Input';
import { RegisterFormData, FormErrors } from '../../../types';
import Dropdown from '@/components/ui/Dropdown';

// Removed duplicate Input component declaration to avoid export conflict.

interface Step2Props {
    formData: RegisterFormData;
    errors: FormErrors<RegisterFormData>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDropdownChange: (id: keyof RegisterFormData, value: string) => void;
    t: (key: string) => string;
}

const FlagLabel = ({
    code,
    country,
    dialCode
}: {
    code: string;
    country: string;
    dialCode: string;
}) => (
    <div className="flex items-center gap-2">
        <img
            src={`https://flagcdn.com/w20/${code}.png`}
            srcSet={`https://flagcdn.com/w40/${code}.png 2x`}
            width="20"
            height="15"
            alt={country}
            className="rounded-sm"
        />
        <span className="text-sm font-medium">
            {country} ({dialCode})
        </span>
    </div>
);

const Step2Personal: React.FC<Step2Props> = ({
    formData,
    errors,
    handleInputChange,
    handleDropdownChange,
    t
}) => {

    // ✅ Ref to close Time picker after selection
    const timeOfBirthRef = useRef<HTMLInputElement>(null);

    // ✅ Country code options
    const countryCodeOptions = [
        { value: '+61', label: <FlagLabel code="au" country="AUS" dialCode="+61" /> },
        { value: '+64', label: <FlagLabel code="nz" country="NZL" dialCode="+64" /> },
        { value: '+91', label: <FlagLabel code="in" country="IND" dialCode="+91" /> },
        { value: '+880', label: <FlagLabel code="bd" country="BAN" dialCode="+880" /> },
        { value: '+94', label: <FlagLabel code="lk" country="SRI" dialCode="+94" /> },
        { value: '+977', label: <FlagLabel code="np" country="NEP" dialCode="+977" /> },
        { value: '+975', label: <FlagLabel code="bt" country="BHU" dialCode="+975" /> },

        { value: '+44', label: <FlagLabel code="gb" country="GBR" dialCode="+44" /> },
        { value: '+49', label: <FlagLabel code="de" country="GER" dialCode="+49" /> },
        { value: '+33', label: <FlagLabel code="fr" country="FRA" dialCode="+33" /> },
        { value: '+39', label: <FlagLabel code="it" country="ITA" dialCode="+39" /> },
        { value: '+34', label: <FlagLabel code="es" country="ESP" dialCode="+34" /> },
        { value: '+31', label: <FlagLabel code="nl" country="NET" dialCode="+31" /> },

        { value: '+1', label: <FlagLabel code="us" country="USA" dialCode="+1" /> },
        { value: '+65', label: <FlagLabel code="sg" country="SIN" dialCode="+65" /> }
    ];

    return (
        <div className="space-y-6">
            <Input
                id="dateOfBirth"
                name="dateOfBirth"
                required
                label={t('register.dob')}
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={errors.dateOfBirth}
                max={new Date().toISOString().split('T')[0]}
            />

            {/* ✅ Time picker closes after selection */}
            <Input
                id="timeOfBirth"
                name="timeOfBirth"
                required
                label={t('register.tob')}
                type="time"
                value={formData.timeOfBirth}
                onChange={(e) => {
                    handleInputChange(e);
                    setTimeout(() => timeOfBirthRef.current?.blur(), 0);
                }}
                error={errors.timeOfBirth}
                ref={timeOfBirthRef}
            />

            <Dropdown
                id="gender"
                label={t('profile.gender')}
                value={formData.gender}
                error={errors.gender}
                onChange={(value) => handleDropdownChange('gender', value)}
                options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' }
                ]}
                required={true}
            />

            {/* ✅ Country Code + Mobile Number (Mobile-first) */}
            <div className="flex gap-3">
                <Dropdown
                    id="countryCode"
                    label={t('register.countryCode')}
                    value={formData.countryCode}
                    error={errors.countryCode}
                    onChange={(value) => handleDropdownChange('countryCode', value)}
                    options={countryCodeOptions}
                    required={true}
                />

                <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    required
                    label={t('register.mobile')}
                    type="number"
                    value={formData.mobileNumber || ''}
                    onChange={handleInputChange}
                    error={errors.mobileNumber}
                    placeholder="e.g., 9876543210"
                />
            </div>

            <Input
                id="height"
                name="height"
                required
                label={t('register.height')}
                type="number"
                value={formData.height}
                onChange={handleInputChange}
                error={errors.height}
                placeholder="170"
                min="50"
                max="250"
            />

            <Input
                id="profession"
                name="profession"
                label={t('register.profession')}
                type="text"
                value={formData.profession}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer"
            />

            <Input
                id="education"
                name="education"
                label={t('register.education')}
                type="text"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="e.g., B.Tech in Computer Science"
            />
        </div>
    );
};

export default Step2Personal;