# School Letter Helper LP

Cloudflare Pagesでそのまま公開できる、HTML/CSS/JavaScriptのみの静的LPです。

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
https://school-letter-helper-lp.pages.dev/ogp.svg
```

`index.html` では以下を設定しています。

- `og:image`
- `og:image:type`
- `og:image:width`
- `og:image:height`
- `twitter:image`
- `twitter:card`

現在は編集しやすいSVG形式です。SNS側のプレビュー互換性をより重視する場合は、同じデザインを `ogp.png` に変換し、`index.html` の `og:image` と `twitter:image` を `https://school-letter-helper-lp.pages.dev/ogp.png` に変更してください。

## 構成

- `index.html`: 日本語LP、事前登録フォーム、SEO/OGP meta
- `style.css`: レスポンシブ対応のスタイル
- `privacy.html`: 簡易プライバシーポリシー
- `ogp.svg`: OGP共有画像
- `sitemap.xml`: 検索エンジン向けサイトマップ
- `robots.txt`: クロール許可とサイトマップURL
- `README.md`: デプロイ手順、フォーム仕様

## 公開前に差し替える項目

- `index.html`
  - `FORMSPREE_ENDPOINT_HERE`
  - `https://school-letter-helper-lp.pages.dev/`
  - `https://school-letter-helper-lp.pages.dev/ogp.svg`
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
