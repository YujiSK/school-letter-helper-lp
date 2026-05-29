import { NextResponse } from 'next/server';
import { AnalysisResult } from '@/types/analysis';

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    // リクエストの受信自体はパースするが、画像データなどの個人情報を含む値はログ出力しない
    const body = await request.json();
    const targetLang = body.targetLang || 'en';

    // 1.5秒の疑似遅延
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // ユニークIDを生成（モック用）
    const id = `mock-uuid-${Date.now()}`;

    // モックデータ（遠足のお知らせ）
    const mockResult: AnalysisResult = {
      id,
      analyzedAt: new Date().toISOString(),
      title: '遠足のお知らせ (Field Trip Notice)',
      easyJapaneseSummary: [
        '6がつ12にち（きんようび）に えんそくに いきます。',
        'おべんとう、みずとう、ぼうし を もってきてください。',
        'さんかせんしょ（かみ）を 6がつ5にち までに だしてください。'
      ],
      translatedSummary: getTranslatedSummary(targetLang),
      todos: [
        {
          id: 'todo-1',
          task: getTranslatedTodo('consent', targetLang),
          deadline: '6月5日',
          completed: false
        },
        {
          id: 'todo-2',
          task: getTranslatedTodo('lunch', targetLang),
          deadline: '6月12日',
          completed: false
        }
      ],
      replyTemplates: getReplyTemplates()
    };

    const duration = Date.now() - startTime;
    
    // セキュリティルールに従い、個人情報を含まないメタデータのみログ出力する
    console.log(`[API Analyze] Success: true, Duration: ${duration}ms, Lang: ${targetLang}`);

    return NextResponse.json(mockResult);
  } catch {
    const duration = Date.now() - startTime;
    console.error(`[API Analyze] Error: Request failed, Duration: ${duration}ms`);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}

// 選択言語に応じた翻訳サマリーを返す（モック）
function getTranslatedSummary(lang: string): string[] {
  switch (lang) {
    case 'en':
      return [
        'The school trip will take place on June 12th (Friday).',
        'Please bring a lunch box, water bottle, and hat.',
        'Please submit the consent form (paper) by June 5th.'
      ];
    case 'pt':
      return [
        'A excursão escolar será realizada no dia 12 de junho (sexta-feira).',
        'Por favor, traga marmita (obento), garrafa de água e boné.',
        'Por favor, entregue o formulário de consentimento (papel) até o dia 5 de junho.'
      ];
    case 'vi':
      return [
        'Chuyến dã ngoại của trường sẽ diễn ra vào ngày 12 tháng 6 (Thứ Sáu).',
        'Vui lòng mang theo hộp cơm trưa, bình nước và mũ.',
        'Vui lòng nộp đơn đồng ý (bản giấy) trước ngày 5 tháng 6.'
      ];
    default:
      return [
        '6がつ12にち（きんようび）に えんそくに いきます。',
        'おべんとう、みずとう、ぼうし を もってきてください。',
        'さんかせんしょ（かみ）を 6がつ5にち までに だしてください。'
      ];
  }
}

// 選択言語に応じたToDoタスク名を返す（モック）
function getTranslatedTodo(type: 'consent' | 'lunch', lang: string): string {
  if (type === 'consent') {
    switch (lang) {
      case 'en': return 'Submit consent form (参加同意書の提出)';
      case 'pt': return 'Entregar formulário de consentimento (参加同意書の提出)';
      case 'vi': return 'Nộp đơn đồng ý tham gia (参加同意書の提出)';
      default: return '参加同意書の提出';
    }
  } else {
    switch (lang) {
      case 'en': return 'Prepare lunch box, water bottle, and hat (お弁当・水筒・帽子の準備)';
      case 'pt': return 'Preparar marmita, garrafa de água e boné (お弁当・水筒・帽子の準備)';
      case 'vi': return 'Chuẩn bị cơm trưa, bình nước và mũ (お弁当・水筒・帽子の準備)';
      default: return 'お弁当・水筒・帽子の準備';
    }
  }
}

// 返信文テンプレート（モック）
function getReplyTemplates() {
  return {
    attendance: 'いつもお世話になっております。遠足の件、参加いたします。よろしくお願いいたします。',
    absence: 'いつもお世話になっております。遠足の件、当日は体調不良のため欠席とさせていただきます。よろしくお願いいたします。',
    late: 'いつもお世話になっております。遠足の件、当日は私用のため遅れて参加いたします。よろしくお願いいたします。',
    question: 'いつもお世話になっております。遠足の件で質問なのですが、当日の服装は体操服でしょうか。よろしくお願いいたします。'
  };
}
