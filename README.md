# School Letter Helper LP

Cloudflare Pagesでそのまま公開できる、HTML/CSS/JavaScriptのみの静的LPです。

## 構成

- `index.html`: 日本語LP
- `style.css`: レスポンシブ対応のスタイル
- `privacy.html`: 簡易プライバシーポリシー
- `README.md`: デプロイ手順

## 公開前に差し替える項目

- `index.html`
  - `https://forms.gle/REPLACE_WITH_YOUR_FORM_ID`
  - `https://school-letter-helper.pages.dev/`
  - `https://school-letter-helper.pages.dev/ogp.png`
- `privacy.html`
  - `REPLACE_WITH_YOUR_EMAIL`
  - `https://school-letter-helper.pages.dev/privacy.html`

OGP画像を使う場合は、`ogp.png` を追加してください。画像が未用意でもページ公開自体は可能です。

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

## フォーム項目の例

Google FormsまたはTallyで、最初は次の程度に絞る想定です。

- 名前 任意
- メールアドレス
- 立場: 保護者 / 支援者 / 先生 / NPO / その他
- 使いたい言語
- 学校プリントで困った経験
- 一番ほしい機能
- テスト版に参加したいか

子どもの氏名、学校名、住所などの入力は推奨しない方針です。
