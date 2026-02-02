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

const Step4Family: React.FC<Step4Props> = ({
    formData,
    errors,
    handleInputChange,
    handleDropdownChange,
    t
}) => {
    const isParentContact = formData.contactPerson === 'parent';

    // ✅ Same country code list as Step2Personal
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
            {/* Existing fields – untouched */}
            <Input
                name="fatherName"
                label={t('profile.details.father_name')}
                type="text"
                value={formData.fatherName}
                onChange={handleInputChange}
                error={errors.fatherName}
            />

            <Input
                name="motherName"
                label={t('profile.details.mother_name')}
                type="text"
                value={formData.motherName}
                onChange={handleInputChange}
                error={errors.motherName}
            />

            <Input
                name="siblings"
                label={t('profile.details.siblings')}
                type="text"
                value={formData.siblings}
                onChange={handleInputChange}
                placeholder="e.g., 1 elder brother"
            />

            <Dropdown
                id="familyValues"
                label={t('profile.details.family_values')}
                value={formData.familyValues}
                onChange={(value) => handleDropdownChange('familyValues', value)}
                options={[
                    { value: 'Moderate', label: 'Moderate' },
                    { value: 'Traditional', label: 'Traditional' },
                    { value: 'Liberal', label: 'Liberal' }
                ]}
            />

            {/* ✅ Contact Person */}
            <Dropdown
                id="contactPerson"
                label={t('profile.details.contact_person')}
                value={formData.contactPerson || 'self'}
                onChange={(value) => handleDropdownChange('contactPerson', value)}
                options={[
                    { value: 'self', label: 'Self' },
                    { value: 'parent', label: 'Parent' }
                ]}
                required
            />

            {/* ✅ Parent Contact Details */}
            {isParentContact && (
                <div className="space-y-6">
                    <Input
                        name="parentsEmail"
                        label={t('profile.details.parents_email')}
                        type="email"
                        value={formData.parentsEmail}
                        onChange={handleInputChange}
                        error={errors.parentsEmail}
                        required
                    />

                    <div className="flex gap-3">
                        <Dropdown
                            id="parentsCountryCode"
                            label={t('profile.details.parents_country_code')}
                            value={formData.parentsCountryCode || '+61'}
                            onChange={(value) =>
                                handleDropdownChange('parentsCountryCode', value)
                            }
                            options={countryCodeOptions}
                            required
                        />

                        <Input
                            name="parentsMobileNumber"
                            label={t('profile.details.parents_mobile')}
                            type="number"
                            value={formData.parentsMobileNumber}
                            onChange={handleInputChange}
                            error={errors.parentsMobileNumber}
                            required
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step4Family;
