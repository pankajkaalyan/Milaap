import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Language, DropdownSize } from '../../types';
import Dropdown from './Dropdown';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useAppContext();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const options = [
    { value: 'en', label: 'EN' },
    { value: 'hi', label: 'HI' },
  ];

  return (
    <Dropdown
      ariaLabel="Select language"
      value={language}
      onChange={(value) => handleLanguageChange(value as Language)}
      options={options}
      size={DropdownSize.SMALL}
    />
  );
};

export default LanguageSwitcher;