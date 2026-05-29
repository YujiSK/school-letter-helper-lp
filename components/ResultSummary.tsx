'use client';

import { useState } from 'react';
import { TranslationDict } from '@/lib/translations';

interface ResultSummaryProps {
  t: TranslationDict;
  easySummary: string[];
  translatedSummary: string[];
  originalText?: string;
}

export default function ResultSummary({
  t,
  easySummary,
  translatedSummary,
  originalText,
}: ResultSummaryProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="space-y-6">
      {/* やさしい日本語 */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-950/10">
        <h3 className="flex items-center gap-2 text-base font-semibold text-blue-800 dark:text-blue-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            あ
          </span>
          {t.easyJapanese}
        </h3>
        <ul className="mt-3 list-disc pl-5 space-y-2 text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
          {easySummary.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 翻訳 */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 dark:border-indigo-900/20 dark:bg-indigo-950/5">
        <h3 className="flex items-center gap-2 text-base font-semibold text-indigo-800 dark:text-indigo-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 0 6-.371m0 0c1.12 0 2.233-.038 3.334-.114M9 5.25V3m3.334 2.25C11.97 8.542 10.236 11.36 8.25 13.518M3.25 9.68a48.59 48.59 0 0 1-1.75-.174M13.447 14.478a48.3 48.3 0 0 0-2.2-2.383m-.803-1.121c.889-1.204 1.589-2.508 2.094-3.893m-8.11 9.59 1.125-3.22m0 0A17.936 17.936 0 0 1 8.25 13.5m-5 5.85A10.582 10.582 0 0 1 3 13.5M3 13.5c.078-.315.118-.641.118-.975v-.119M11.25 18a17.974 17.974 0 0 0-2.625-3.723"
            />
          </svg>
          {t.translation}
        </h3>
        <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {translatedSummary.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 原文表示（折りたたみ） */}
      {originalText && (
        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                showOriginal ? 'rotate-90' : ''
              }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            {t.viewOriginal}
          </button>
          {showOriginal && (
            <div className="mt-2 rounded-lg bg-gray-50 p-4 border border-gray-200 text-xs font-mono text-gray-600 dark:bg-gray-900/30 dark:border-gray-800 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
              {originalText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
