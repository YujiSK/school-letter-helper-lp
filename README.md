# School Letter Helper | 学校プリントをやることリストに変える

外国人保護者向けの学校おたより要約・ToDo化・返信支援サービス「School Letter Helper」のランディングページ（LP）プロジェクトです。
Cloudflare Pagesでそのまま公開できる、HTML/CSS/JavaScriptのみの静的LPで構築されています。

## 事業概要

- **ビジョン**: 「日本の学校プリントが読めない・書けない」という外国人保護者の不安を取り除き、子どもが学校生活で不利益を被るのを防ぐ。
- **顧客のジョブ (JTBD)**: 
  - **保護者**: 期限や持ち物を正しく理解し、自力で適切な対応（署名・準備・返信）を完遂したい。
  - **教職員**: 日本語能力に関わらず、すべての家庭に期限内にお知らせを確実に理解してもらい、催促の負担をなくしたい。
- **解決策 (MVP機能)**: スマホで撮影した学校プリントから、AIが重要事項（締切・持ち物・ToDo）を自動抽出し、やさしい日本語や母語に要約・翻訳。失礼のない返信文の下書き生成までをサポート。
- **設計思想**: 個人情報保護を最優先とし、アップロードされた画像やOCRテキストはサーバー側のデータベースやファイルストレージに一切保存せず、ブラウザ（LocalStorage）のみで完結させる「完全プライバシー保護型ステートレス解析」を採用。

## 公開URL

https://school-letter-helper-lp.pages.dev/

## SEO初期設定

検索エンジン向けに以下のファイルを追加しています。

- `sitemap.xml`
- `robots.txt`

Google Search Consoleに登録する場合は、サイトマップURLとして次を送信してください。

```text
https://school-letter-helper-lp.pages.dev/sitemap.xml
```

## OGP画像

SNSやメッセージアプリで共有したときの表示用に、OGP画像を追加しています。

```text
https://school-letter-helper-lp.pages.dev/ogp.png
```

`index.html` では以下を設定しています。

- `og:image`
- `og:image:type`
- `og:image:width`
- `og:image:height`
- `twitter:image`
- `twitter:card`

編集しやすい元データとして `ogp.svg` も残しています。SNS側のプレビュー互換性を重視するため、公開用メタタグはPNGを参照します。

## 構成

- `index.html`: 日本語LP、事前登録フォーム、SEO/OGP meta
- `style.css`: レスポンシブ対応のスタイル
- `privacy.html`: 簡易プライバシーポリシー
- `ogp.png`: OGP共有画像
- `ogp.svg`: OGP共有画像の編集用SVG
- `sitemap.xml`: 検索エンジン向けサイトマップ
- `robots.txt`: クロール許可とサイトマップURL
- `README.md`: デプロイ手順、フォーム仕様

## 公開前に差し替える項目

- `index.html`
  - `FORMSPREE_ENDPOINT_HERE`
  - `https://school-letter-helper-lp.pages.dev/`
  - `https://school-letter-helper-lp.pages.dev/ogp.png`
- `privacy.html`
  - `REPLACE_WITH_YOUR_EMAIL`
  - `https://school-letter-helper-lp.pages.dev/privacy.html`

## Formspree endpoint の差し替え方法

`index.html` のフォームにある次の値を、実際のFormspree endpointに置き換えます。

```html
<form class="lead-form" action="FORMSPREE_ENDPOINT_HERE" method="POST">
```

例:

```html
<form class="lead-form" action="https://formspree.io/f/xxxxxxx" method="POST">
```

Formspreeに依存しているのは `action` URLだけです。JavaScriptにはFormspree固有処理を入れていません。

## フォーム仕様

| label | name | type | required | allowed values | purpose |
| --- | --- | --- | --- | --- | --- |
| あなたの立場 | `role` | select | yes | `parent`, `supporter`, `teacher`, `npo`, `other` | 需要がある利用者層を把握する |
| 主に使いたい言語 | `language` | select | yes | `portuguese`, `english`, `spanish`, `tagalog`, `vietnamese`, `easy_japanese`, `other` | 対応言語の優先度を決める |
| 学校プリントや学校連絡で困った経験はありますか？ | `pain_experience` | radio | yes | `often`, `sometimes`, `rarely`, `supporting_others` | 課題の強さと支援者経由の需要を把握する |
| 一番ほしい機能 | `wanted_feature` | select | yes | `easy_japanese`, `translation`, `todo_extraction`, `reply_template`, `deadline_reminder`, `other` | 初期機能の優先度を決める |
| テスト版に参加したいですか？ | `beta_interest` | radio | yes | `yes`, `maybe`, `notify_only` | テスト版参加者と通知希望者を分ける |
| 連絡用メールアドレス | `email` | email | yes | valid email address | テスト版案内、リリース通知、追加ヒアリングに使う |
| 困っていること・ほしい機能があれば教えてください | `message` | textarea | no | free text | 具体的な困りごとや機能要望を把握する |
| 送信元 | `source` | hidden | yes | `lp_form` | 送信元を識別する |
| サービス名 | `service` | hidden | yes | `school_letter_helper` | 複数サービス運用時に識別する |
| 件名 | `_subject` | hidden | yes | `School Letter Helper 事前登録` | Formspree通知メールの件名に使う |
| honeypot | `_gotcha` | text hidden by CSS | no | empty | bot送信対策 |

## 将来自前APIへ移行する場合

Cloudflare Workers、Pages Functions、D1などへ移行する場合は、フォームの `action` を差し替えます。

```html
<form class="lead-form" action="/api/lead" method="POST">
```

移行時も `name` 属性と `value` は変更しない方針です。既存CSV、Formspree export、D1などへ移すときに項目名を固定しておくことで、データ移行と集計をしやすくします。

## 個人情報入力を避ける方針

このフォームは、子どもの名前、学校名、住所、電話番号、クラス名、出席番号、学校プリント画像などを集めない設計です。

自由記述欄にも、子どもの名前、学校名、住所、電話番号などを書かないよう注意文を表示しています。

## ローカル確認

Pythonが入っている場合:

```powershell
python -m http.server 8787 --bind 127.0.0.1
```

ブラウザで開きます。

```text
http://localhost:8787/
```

## Cloudflare Pagesで公開する手順

1. GitHubにこのリポジトリをpushする
2. Cloudflareにログインする
3. `Workers & Pages` を開く
4. `Create` → `Pages` を選ぶ
5. GitHubリポジトリを接続する
6. ビルド設定を次のようにする

```text
Framework preset: None
Build command: 空欄
Build output directory: /
```

7. `Deploy` を押す
8. `https://<project-name>.pages.dev` で表示を確認する
