'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnalysisResult, AppSettings } from '@/types/analysis';
import { getAppSettings, saveAppSettings, getHistory } from '@/lib/localStorage';
import { TRANSLATIONS } from '@/lib/translations';
import ReplyTemplateCard from '@/components/ReplyTemplateCard';

function ReplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const temp = searchParams.get('temp') === 'true';

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');

  useEffect(() => {
    const appSettings = getAppSettings();
    
    Promise.resolve().then(() => {
      setSettings(appSettings);
      setChildName(appSettings.defaultChildName || '');
      setParentName(appSettings.defaultParentName || '');
    });

    if (!id) return;

    if (temp) {
      try {
        const raw = sessionStorage.getItem(`temp_analysis_${id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          Promise.resolve().then(() => setData(parsed));
        }
      } catch {
        // 警告回避
      }
    } else {
      const history = getHistory();
      const match = history.find((h) => h.id === id);
      if (match) {
        Promise.resolve().then(() => setData(match));
      }
    }
  }, [id, temp]);

  const handleChildNameChange = (name: string) => {
    setChildName(name);
    saveAppSettings({ defaultChildName: name });
  };

  const handleParentNameChange = (name: string) => {
    setParentName(name);
    saveAppSettings({ defaultParentName: name });
  };

  if (!settings || !id) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  const t = TRANSLATIONS[settings.language];

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
        <p className="text-sm font-semibold text-gray-500">解析データが見つかりませんでした。</p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
        >
          {t.home}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 py-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4">
          <button
            type="button"
            onClick={() => router.push(`/result?id=${id}${temp ? '&temp=true' : ''}`)}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            {t.back}
          </button>
          <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
            {t.reply}
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-xl px-4">
        <ReplyTemplateCard
          t={t}
          templates={data.replyTemplates}
          childName={childName}
          parentName={parentName}
          onChildNameChange={handleChildNameChange}
          onParentNameChange={handleParentNameChange}
        />
      </main>
    </div>
  );
}

export default function ReplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900" />}>
      <ReplyContent />
    </Suspense>
  );
}
