export interface AppSettings {
  language: 'ja' | 'en' | 'pt' | 'vi'; // UI表示言語
  saveHistory: boolean;                 // 履歴保存の有効/無効
  defaultParentName?: string;          // 保護者名の保存（自動入力用）
  defaultChildName?: string;           // 児童名の保存（自動入力用）
}

export interface ToDoItem {
  id: string;
  task: string;
  deadline?: string;
  completed: boolean;
}

export interface AnalysisResult {
  id: string;                         // ユニークID
  analyzedAt: string;                 // 解析日時 (ISO)
  title: string;                      // 簡易タイトル
  easyJapaneseSummary: string[];      // やさしい日本語要約（箇条書き）
  translatedSummary: string[];        // 翻訳された要約（箇条書き）
  todos: ToDoItem[];                  // ToDoリスト
  replyTemplates: {
    attendance: string;
    absence: string;
    late?: string;
    question?: string;
  };
}

export interface LocalStorageData {
  settings: AppSettings;
  history: AnalysisResult[];
}
