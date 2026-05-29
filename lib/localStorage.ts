import { AppSettings, AnalysisResult } from '@/types/analysis';

const STORAGE_KEYS = {
  SETTINGS: 'school_letter_settings',
  HISTORY: 'school_letter_history',
};

const DEFAULT_SETTINGS: AppSettings = {
  language: 'ja',
  saveHistory: true,
};

// サーバーサイドレンダリング時の window 未定義エラー防止
const isBrowser = () => typeof window !== 'undefined';

export function getAppSettings(): AppSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch {
    // 個人情報・エラー詳細は console.log しない方針
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: Partial<AppSettings>): void {
  if (!isBrowser()) return;
  try {
    const current = getAppSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch {
    // ログ抑制
  }
}

export function getHistory(): AnalysisResult[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: AnalysisResult): void {
  if (!isBrowser()) return;
  const settings = getAppSettings();
  if (!settings.saveHistory) return;

  try {
    const history = getHistory();
    // 重複チェック（IDが同じなら上書き、それ以外なら追加）
    const existingIndex = history.findIndex((h) => h.id === entry.id);
    if (existingIndex > -1) {
      history[existingIndex] = entry;
    } else {
      history.unshift(entry); // 先頭に追加
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch {
    // ログ抑制
  }
}

export function updateTodoStatus(
  entryId: string,
  todoId: string,
  completed: boolean
): void {
  if (!isBrowser()) return;
  try {
    const history = getHistory();
    const entry = history.find((h) => h.id === entryId);
    if (entry) {
      const todo = entry.todos.find((t) => t.id === todoId);
      if (todo) {
        todo.completed = completed;
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      }
    }
  } catch {
    // ログ抑制
  }
}

export function clearAllHistory(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch {
    // ログ抑制
  }
}
