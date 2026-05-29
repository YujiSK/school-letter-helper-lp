'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnalysisResult, AppSettings } from '@/types/analysis';
import { getAppSettings, getHistory, updateTodoStatus } from '@/lib/localStorage';
import { TRANSLATIONS } from '@/lib/translations';
import ResultSummary from '@/components/ResultSummary';
import TodoList from '@/components/TodoList';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const temp = searchParams.get('temp') === 'true';

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'todo'>('summary');

  useEffect(() => {
    const appSettings = getAppSettings();
    Promise.resolve().then(() => setSettings(appSettings));

    if (!id) return;

    if (temp) {
      // 一時保存（sessionStorage）からロード
      try {
        const raw = sessionStorage.getItem(`temp_analysis_${id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          Promise.resolve().then(() => setData(parsed));
        }
      } catch {
        // ログ抑制
      }
    } else {
      // 履歴（LocalStorage）からロード
      const history = getHistory();
      const match = history.find((h) => h.id === id);
      if (match) {
        Promise.resolve().then(() => setData(match));
      }
    }
  }, [id, temp]);

  const handleToggleTodo = (todoId: string, completed: boolean) => {
    if (!data || !id) return;

    const updatedTodos = data.todos.map((t) =>
      t.id === todoId ? { ...t, completed } : t
    );
    const updatedData = { ...data, todos: updatedTodos };
    setData(updatedData);

    if (temp) {
      try {
        sessionStorage.setItem(`temp_analysis_${id}`, JSON.stringify(updatedData));
      } catch {
        // ログ抑制
      }
    } else {
      updateTodoStatus(id, todoId, completed);
    }
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
            onClick={() => router.push('/')}
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
            {data.title}
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-xl px-4 space-y-6">
        {/* タブナビゲーション */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition-all ${
              activeTab === 'summary'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {t.translation} / {t.easyJapanese}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('todo')}
            className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition-all ${
              activeTab === 'todo'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {t.todo} ({data.todos.filter((t) => !t.completed).length})
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="min-h-[300px]">
          {activeTab === 'summary' ? (
            <ResultSummary
              t={t}
              easySummary={data.easyJapaneseSummary}
              translatedSummary={data.translatedSummary}
              originalText={`【学校おたより原文（OCR模擬データ）】
令和8年5月29日
保護者の皆様へ
〇〇小学校 校長 鈴木 茂

「春の遠足のお知らせ」
初夏の候、保護者の皆様におかれましては益々ご健勝のこととお慶び申し上げます。
さて、今年度も児童の体力向上と自然観察を目的として、以下の通り春の遠足を実施いたします。

1. 日時：令和8年6月12日（金）午前9時出発（雨天決行）
2. 行き先：中央森林公園
3. 持ち物：お弁当、水筒、帽子、敷物、雨具
4. 提出物：「遠足参加同意書」を6月5日（金）までに学級担任へご提出ください。`}
            />
          ) : (
            <TodoList todos={data.todos} onToggleTodo={handleToggleTodo} />
          )}
        </div>

        {/* 下部アクションボタン */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => router.push(`/reply?id=${id}${temp ? '&temp=true' : ''}`)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 text-sm shadow-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4.5 w-4.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
            {t.reply}をつくる
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900" />}>
      <ResultContent />
    </Suspense>
  );
}
