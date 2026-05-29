'use client';

import { LanguageCode } from '@/lib/translations';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
}

export default function LanguageSelector({
  currentLanguage,
  onChangeLanguage,
}: LanguageSelectorProps) {
  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'ja', label: 'やさしい日本語' },
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'vi', label: 'Tiếng Việt' },
  ];

  return (
    <div className="relative inline-block text-left">
      <select
        value={currentLanguage}
        onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
