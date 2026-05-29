'use client';

import { useState } from 'react';
import { TranslationDict } from '@/lib/translations';

interface ReplyTemplateCardProps {
  t: TranslationDict;
  templates: {
    attendance: string;
    absence: string;
    late?: string;
    question?: string;
  };
  childName: string;
  parentName: string;
  onChildNameChange: (name: string) => void;
  onParentNameChange: (name: string) => void;
}

type ReplyType = 'attendance' | 'absence' | 'late' | 'question';

export default function ReplyTemplateCard({
  t,
  templates,
  childName,
  parentName,
  onChildNameChange,
  onParentNameChange,
}: ReplyTemplateCardProps) {
  const [replyType, setReplyType] = useState<ReplyType>('attendance');
  const [reason, setReason] = useState('');
  const [copied, setCopied] = useState(false);

  // 選択されたテンプレートや入力値に応じて返信文をリアルタイム生成
  let baseText = templates[replyType] || '';
  
  // お子様名の置換 (〇〇 などを置換)
  if (childName) {
    baseText = baseText.replace(/〇\s?〇/g, childName);
  }

  // 理由の反映 (欠席・遅刻・質問の場合のみ、理由を入力値で補強)
  if (reason) {
    if (replyType === 'absence') {
      baseText = baseText.replace('当日は体調不良のため', `当日は${reason}のため`);
    } else if (replyType === 'late') {
      baseText = baseText.replace('当日は私用のため', `当日は${reason}のため`);
    } else if (replyType === 'question') {
      baseText = baseText.replace('遠足の件で質問なのですが、当日の服装は体操服でしょうか。', reason);
    }
  }

  // 保護者名の置換
  if (parentName) {
    baseText = baseText.replace('保護者です', `保護者の${parentName}です`);
  }

  const generatedText = baseText;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ログ抑制
    }
  };

  return (
    <div className="space-y-6">
      {/* 目的の選択 */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(['attendance', 'absence', 'late', 'question'] as ReplyType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setReplyType(type);
              setReason(''); // タイプ変更時に理由はリセット
            }}
            className={`rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-all duration-150 ${
              replyType === type
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-300'
                : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-750 dark:text-gray-300'
            }`}
          >
            {type === 'attendance' && t.attendance}
            {type === 'absence' && t.absence}
            {type === 'late' && t.late}
            {type === 'question' && t.question}
          </button>
        ))}
      </div>

      {/* 入力フォーム */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-700 dark:bg-gray-900/10 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              {t.childName}
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => onChildNameChange(e.target.value)}
              placeholder="例: 太郎 (Taro)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              {t.parentName}
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => onParentNameChange(e.target.value)}
              placeholder="例: 花子 (Hanako)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        {/* 理由入力（特定のタイプのみ表示） */}
        {replyType !== 'attendance' && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              {replyType === 'question' ? '質問内容 (Question)' : t.reason}
            </label>
            {replyType !== 'question' && (
              <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                {['熱がある', '用事がある', '体調が悪い'].map((quickReason) => (
                  <button
                    key={quickReason}
                    type="button"
                    onClick={() => setReason(quickReason)}
                    className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-indigo-300 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-350"
                  >
                    {quickReason}
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                replyType === 'question'
                  ? '例: お弁当はいりますか？'
                  : '例: 熱があるため (Fever)'
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
        )}
      </div>

      {/* プレビューとコピー */}
      <div className="space-y-2">
        <div className="relative rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed min-h-[80px]">
            {generatedText}
          </p>
          
          {/* コピートースト表示用 */}
          {copied && (
            <div className="absolute top-2 right-2 rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
              {t.copied}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-sm transition-colors duration-150"
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
              d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.346.102.637.318.806.62.176.312.274.675.274 1.06V19.5a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25V5.5c0-.385.098-.748.274-1.06.17-.302.46-.518.806-.62M18 7.75h-.008v.008H18V7.75Zm-6A2.25 2.25 0 0 1 9.75 10h.008a2.25 2.25 0 0 1 2.242-2.25h.008v.008h-.008Z"
            />
          </svg>
          {t.copy}
        </button>
      </div>
    </div>
  );
}
