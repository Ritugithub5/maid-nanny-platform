import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    en: 'English 🇬🇧',
    hi: 'हिन्दी 🇮🇳',
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-md cursor-pointer"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageNames[lang] || lang}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <FaGlobe className="text-sm" />
      </div>
    </div>
  );
};

export default LanguageSwitcher;