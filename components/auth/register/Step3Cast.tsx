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

const Step3Caste: React.FC<Step3Props> = ({ formData, errors, handleInputChange, handleDropdownChange, t }) => {
    return (
        <div className="space-y-6">
            <Input name="caste" required label={t('register.caste')} type="text" value={formData.caste} onChange={handleInputChange} error={errors.caste} placeholder="e.g., Brahmin" />
            <Input name="subCaste" label={t('register.subcaste')} type="text" value={formData.subCaste} onChange={handleInputChange} placeholder="e.g., Gaur" />
            <Input name="gotra" required label={t('profile.details.gotra')} type="text" value={formData.gotra} onChange={handleInputChange} error={errors.gotra} placeholder="e.g., Kashyap" />
            <Dropdown
                id="mangalDosha"
                label={t('profile.details.mangal_dosha')}
                value={formData.mangalDosha}
                onChange={(value) => handleDropdownChange('mangalDosha', value)}
                options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }, { value: 'Partial', label: 'Partial' }]}
            />
            <Dropdown
                id="rashi"
                label={t('profile.details.rashi')}
                value={formData.rashi}
                onChange={(value) => handleDropdownChange('rashi', value)}
                options={[
                    { value: 'Mesh', label: 'Mesh' },
                    { value: 'Vrishabh', label: 'Vrishabh' },
                    { value: 'Mithun', label: 'Mithun' },
                    { value: 'Kark', label: 'Kark' },
                    { value: 'Singh', label: 'Singh' },
                    { value: 'Kanya', label: 'Kanya' },
                    { value: 'Tula', label: 'Tula' },
                    { value: 'Vrischik', label: 'Vrischik' },
                    { value: 'Dhanu', label: 'Dhanu' },
                    { value: 'Makar', label: 'Makar' },
                    { value: 'Kumbh', label: 'Kumbh' },
                    { value: 'Meen', label: 'Meen' }
                ]}
            />
            <Dropdown
                id="nakshatra"
                label={t('profile.details.nakshatra')}
                value={formData.nakshatra}
                onChange={(value) => handleDropdownChange('nakshatra', value)}
                options={
                    (() => {
                        const rashiNaxatraMap: Record<string, { value: string; label: string }[]> = {
                            Mesh: [
                                { value: 'Ashwini', label: 'Ashwini' },
                                { value: 'Bharani', label: 'Bharani' },
                                { value: 'Krittika', label: 'Krittika' }
                            ],
                            Vrishabh: [
                                { value: 'Krittika', label: 'Krittika' },
                                { value: 'Rohini', label: 'Rohini' },
                                { value: 'Mrigashira', label: 'Mrigashira' }
                            ],
                            Mithun: [
                                { value: 'Mrigashira', label: 'Mrigashira' },
                                { value: 'Ardra', label: 'Ardra' },
                                { value: 'Punarvasu', label: 'Punarvasu' }
                            ],
                            Kark: [
                                { value: 'Punarvasu', label: 'Punarvasu' },
                                { value: 'Pushya', label: 'Pushya' },
                                { value: 'Ashlesha', label: 'Ashlesha' }
                            ],
                            Singh: [
                                { value: 'Magha', label: 'Magha' },
                                { value: 'Purva Phalguni', label: 'Purva Phalguni' },
                                { value: 'Uttara Phalguni', label: 'Uttara Phalguni' }
                            ],
                            Kanya: [
                                { value: 'Uttara Phalguni', label: 'Uttara Phalguni' },
                                { value: 'Hasta', label: 'Hasta' },
                                { value: 'Chitra', label: 'Chitra' }
                            ],
                            Tula: [
                                { value: 'Chitra', label: 'Chitra' },
                                { value: 'Swati', label: 'Swati' },
                                { value: 'Vishakha', label: 'Vishakha' }
                            ],
                            Vrischik: [
                                { value: 'Vishakha', label: 'Vishakha' },
                                { value: 'Anuradha', label: 'Anuradha' },
                                { value: 'Jyeshtha', label: 'Jyeshtha' }
                            ],
                            Dhanu: [
                                { value: 'Moola', label: 'Moola' },
                                { value: 'Purva Ashadha', label: 'Purva Ashadha' },
                                { value: 'Uttara Ashadha', label: 'Uttara Ashadha' }
                            ],
                            Makar: [
                                { value: 'Uttara Ashadha', label: 'Uttara Ashadha' },
                                { value: 'Shravana', label: 'Shravana' },
                                { value: 'Dhanishta', label: 'Dhanishta' }
                            ],
                            Kumbh: [
                                { value: 'Dhanishta', label: 'Dhanishta' },
                                { value: 'Shatabhisha', label: 'Shatabhisha' },
                                { value: 'Purva Bhadrapada', label: 'Purva Bhadrapada' }
                            ],
                            Meen: [
                                { value: 'Purva Bhadrapada', label: 'Purva Bhadrapada' },
                                { value: 'Uttara Bhadrapada', label: 'Uttara Bhadrapada' },
                                { value: 'Revati', label: 'Revati' }
                            ]
                        };
                        return rashiNaxatraMap[formData.rashi] || [];
                    })()
                }
            />
        </div>
    );
};

export default Step3Caste;
