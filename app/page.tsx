'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppSettings, AnalysisResult } from '@/types/analysis';
import {
  getAppSettings,
  saveAppSettings,
  getHistory,
  addHistoryEntry,
  clearAllHistory,
} from '@/lib/localStorage';
import { TRANSLATIONS, LanguageCode } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';
import UploadCard from '@/components/UploadCard';

export default function HomePage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  // 初期ロード
  useEffect(() => {
    const appSettings = getAppSettings();
    const appHistory = getHistory();
    Promise.resolve().then(() => {
      setSettings(appSettings);
      setHistory(appHistory);
    });
  }, []);

  // 言語切り替え
  const handleLangChange = (lang: LanguageCode) => {
    if (!settings) return;
    const updated = { ...settings, language: lang };
    setSettings(updated);
    saveAppSettings({ language: lang });
  };

  // 履歴保存のオン/オフ
  const handleSaveHistoryToggle = (checked: boolean) => {
    if (!settings) return;
    const updated = { ...settings, saveHistory: checked };
    setSettings(updated);
    saveAppSettings({ saveHistory: checked });
  };

  // 全履歴削除
  const handleDeleteAllHistory = () => {
    if (!settings) return;
    const t = TRANSLATIONS[settings.language];
    if (confirm(t.deleteConfirm)) {
      clearAllHistory();
      setHistory([]);
    }
  };

  // ローディングテキストの切り替え演出
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % 3);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileSelect = async (file: File) => {
    if (!settings || !file) return;
    setLoading(true);
    setLoadingTextIndex(0);

    try {
      // 本プロトタイプではモックAPIを呼び出す
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: 'data:image/png;base64,mockdata...',
          targetLang: settings.language,
        }),
      });

      if (!response.ok) throw new Error('API error');
      const data: AnalysisResult = await response.json();

      // settings.saveHistory が有効な場合のみLocalStorageに保存
      if (settings.saveHistory) {
        addHistoryEntry(data);
      } else {
        // 保存しない場合は一時的に sessionStorage に保存して `/result?id={id}&temp=true` で遷移
        sessionStorage.setItem(`temp_analysis_${data.id}`, JSON.stringify(data));
      }

      router.push(`/result?id=${data.id}${!settings.saveHistory ? '&temp=true' : ''}`);
    } catch {
      setLoading(false);
      alert('解析に失敗しました。もう一度試してください。');
    }
  };

  if (!settings) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  const t = TRANSLATIONS[settings.language];

  const loadingTexts = [
    t.processing,
    settings.language === 'ja' ? 'やさしい日本語に直しています...' : 'Converting to easy Japanese...',
    settings.language === 'ja' ? 'やることリストを作っています...' : 'Creating to-do list...'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* ローディングオーバーレイ */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-900/90 p-6">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent dark:border-indigo-400"></div>
          <p className="mt-4 text-base font-semibold text-gray-700 dark:text-gray-200">
            {loadingTexts[loadingTextIndex]}
          </p>
        </div>
      )}

      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 py-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4">
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <LanguageSelector
            currentLanguage={settings.language}
            onChangeLanguage={handleLangChange}
          />
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-xl px-4 space-y-6">
        {/* メインの導入 */}
        <div className="text-center py-4">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {t.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>

        {/* アップロードカード */}
        <UploadCard t={t} onFileSelect={handleFileSelect} />

        {/* 設定トグル */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <label
            htmlFor="save-history-toggle"
            className="text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer"
          >
            {t.noSaveHistory}
          </label>
          <input
            id="save-history-toggle"
            type="checkbox"
            checked={!settings.saveHistory}
            onChange={(e) => handleSaveHistoryToggle(!e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        {/* 過去の履歴 */}
        {settings.saveHistory && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">
                {t.historyTitle}
              </h3>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteAllHistory}
                  className="text-xs font-semibold text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                >
                  {t.deleteAllHistory}
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="rounded-xl border border-gray-200 border-dashed bg-white py-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-500">
                {t.emptyHistory}
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/result?id=${item.id}`)}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-300 cursor-pointer transition-all dark:border-gray-800 dark:bg-gray-950 dark:hover:border-indigo-900"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {item.title}
                      </p>
                      <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {new Date(item.analyzedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
