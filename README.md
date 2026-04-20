# RTCK Portfolio 2026 / Portfolio Template

[RTCK (KAZUKI TANAKA)](https://rtck-reina.com) のポートフォリオサイトであり、同時に誰でも自分のポートフォリオとして再利用できる A4 印刷対応テンプレートでもあります。

- 本リポジトリの `portfolio.config.json` / 作品画像は **RTCK 本人の作品データ**です
- `index.html` / `renderer.js` はデータ駆動のテンプレートとして汎用化されています
- Fork して `portfolio.config.json` を書き換えれば、自分のポートフォリオとして公開できます

## 特徴

- データ駆動（HTML は触らない）
- A4 サイズで画面表示 & PDF エクスポート対応
- ビルドツール不要の純粋な HTML / CSS / JS
- GitHub Pages / Netlify / Vercel などにそのままデプロイ可能

---

## Quick Start

1. このリポジトリを Fork または Clone
2. `portfolio.config.json` を自分のデータに書き換え
3. 作品画像（`.png` / `.jpg`）をルートディレクトリに配置
4. GitHub Pages を有効化するか、`index.html` をブラウザで開く

### ローカルプレビュー

`fetch()` で JSON を読み込むため、ローカルではファイルサーバー経由で開く必要があります:

```bash
python -m http.server 8000
# → http://localhost:8000
```

または:

```bash
npx serve .
```

### PDF エクスポート

`Ctrl/Cmd + P` で A4 サイズの PDF を書き出せます。ブラウザの印刷ダイアログで「背景のグラフィック」を有効にしてください。

---

## ファイル構成

```
index.html              ← テンプレート本体（編集不要）
renderer.js             ← JSON を読み込んで描画（編集不要）
portfolio.config.json   ← ここを編集する
README.md
LICENSE
*.png / *.jpg           ← 作品画像（ルートに配置）
```

---

## portfolio.config.json リファレンス

トップレベルのキーは以下の 6 つです。

| キー | 必須 | 内容 |
|------|------|------|
| `meta` | ✓ | 言語、表示年、著作権表示 |
| `profile` | ✓ | ユーザー名・氏名・肩書き・フィロソフィー |
| `contacts` | ✓ | 連絡先リスト |
| `works` | ✓ | 作品ページ（複数） |
| `skills` | ✓ | スキルカテゴリとツール一覧 |
| `education` | ✓ | 学歴情報 |

### `meta`

```json
{
  "lang": "ja",
  "portfolioYear": "2026",
  "copyright": "© 2026 YOUR NAME. All Rights Reserved."
}
```

- `lang`: `<html lang="...">` に反映されます（`ja` / `en` など）
- `portfolioYear`: 表紙に "PORTFOLIO 2026" として表示
- `copyright`: スキルページ右下に表示

### `profile`

```json
{
  "username": "YOURID",
  "name": {
    "display": "YOUR NAME",
    "formatted": "YOUR<br>NAME"
  },
  "title": "Role / Specialty",
  "philosophy": {
    "headline": "「キャッチコピー」",
    "body": "制作に対する想い・信念。<br>改行したい位置に <br> を入れられます。"
  }
}
```

- `name.display`: 1 行表示用（スキルページフッター）
- `name.formatted`: 表紙の大見出し（`<br>` 使用可）
- `philosophy.headline` / `body`: `<br>` など HTML タグが使えます

### `contacts`

```json
[
  { "label": "portfolio", "value": "example.com", "url": "https://example.com" },
  { "label": "github",    "value": "github.com/you", "url": "https://github.com/you" },
  { "label": "email",     "value": "you@example.com", "url": "mailto:you@example.com" }
]
```

表紙に 2 列グリッドで並びます。3 件目までがスキルページのフッターにも自動で出ます。

### `works`

作品ごとに 1 ページ。`type` によってレイアウトが切り替わります。

#### `type: "standard"` — 通常作品

ヒーロー画像 + キーポイント + テックスタック。

```json
{
  "type": "standard",
  "year": "2025",
  "title": "Project Title",
  "subtitle": "Short descriptor",
  "image": "project_hero.png",
  "imageAlt": "Project Title",
  "description": "概要説明テキスト。",
  "metrics": ["1,000+ Users", "Award Winner"],
  "keyPoints": [
    "技術的ハイライト 1",
    "技術的ハイライト 2"
  ],
  "techStack": ["React", "TypeScript", "WebGL"],
  "link": { "text": "→ example.com/project", "url": "https://example.com/project" }
}
```

`link` は省略可能。省略すると表示されません。

#### `type: "product-grid"` — プロダクト一覧

複数プロダクトのグリッド + 反復プロトタイプ写真。

```json
{
  "type": "product-grid",
  "year": "2020—",
  "title": "Products",
  "subtitle": "Short descriptor",
  "products": [
    {
      "name": "Product Name",
      "image": "product1.png",
      "imageAlt": "Product 1",
      "description": "プロダクト説明。"
    }
  ],
  "extraCards": [
    { "label": "NOTE LABEL", "text": "補足カードの本文。" }
  ],
  "iterations": {
    "label": "ITERATIVE PROTOTYPING",
    "items": [
      { "image": "v0.jpg", "alt": "V0", "caption": "V0 — 初期案" },
      { "image": "v1.jpg", "alt": "V1", "caption": "V1 — 改善" }
    ]
  },
  "tags": ["Tag1", "Tag2"],
  "tagsLabel": "DISTRIBUTION"
}
```

`extraCards` / `iterations` / `tags` はいずれも省略可能です。

### `skills`

```json
[
  {
    "category": "DEVELOPMENT",
    "items": [
      { "name": "React", "since": "2023~" },
      { "name": "Python", "since": "2022~" }
    ]
  }
]
```

2 列グリッドで並びます。カテゴリはいくつでも追加可能。

### `education`

```json
{
  "institution": "学校名 / 学部",
  "period": "2023.04 — 2027.03",
  "description": "学んだ内容・受賞歴など。"
}
```

---

## カスタマイズ

### カラーテーマ

`index.html` 冒頭の CSS 変数を編集するだけで色調を変えられます:

```css
:root {
  --accent: #F59E0B;    /* アクセントカラー */
  --bg: #08080a;        /* 背景 */
  --bg-card: #111113;   /* カード背景 */
  --text: #f5f5f4;      /* 本文 */
  --text-muted: #a1a1aa;/* 補助テキスト */
  --border: #27272a;    /* 枠線 */
}
```

### フォント

Google Fonts の `DM Sans`（本文）と `Syne`（見出し）を使用しています。差し替える場合は `<link>` と `font-family` の 2 箇所を変更してください。

### HTML タグが使えるフィールド

以下のフィールドでは `<br>` などの HTML タグが使用できます。それ以外のフィールドは自動でエスケープされます。

- `profile.name.formatted`
- `profile.philosophy.headline`
- `profile.philosophy.body`

---

## デプロイ

### GitHub Pages

1. リポジトリ設定 → **Pages**
2. Source を `Deploy from a branch` にして `main` / `/ (root)` を選択
3. 数分後 `https://<username>.github.io/<repo>/` で公開

### Netlify / Vercel / Cloudflare Pages

ビルド設定不要。リポジトリを連携し、出力ディレクトリをルート（`/`）にするだけで公開できます。

---

## ライセンス

MIT License. `LICENSE` を参照してください。テンプレートを使って作った自分のポートフォリオには、あなた自身の著作権を設定できます。
