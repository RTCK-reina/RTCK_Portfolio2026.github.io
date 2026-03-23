# Portfolio Template

A4 印刷対応のポートフォリオテンプレート。JSON ファイルを編集するだけで自分のポートフォリオを作成できます。

## Quick Start

1. このリポジトリをフォーク or クローン
2. `portfolio.config.json` を自分のデータに編集
3. 画像ファイルをルートディレクトリに配置
4. GitHub Pages にデプロイ（またはそのまま `index.html` を開く）

## ローカル開発

`fetch()` を使用しているため、ローカルではサーバーが必要です:

```bash
python -m http.server
# http://localhost:8000 でアクセス
```

## portfolio.config.json の構造

| セクション | 説明 |
|-----------|------|
| `meta` | 言語、ポートフォリオ年、サブタイトル、著作権表示 |
| `profile` | ユーザー名、氏名、肩書き、フィロソフィー |
| `contacts` | 連絡先リスト（label, value, url） |
| `works` | 作品ページ（`standard` or `product-grid` タイプ） |
| `skills` | スキルカテゴリとツール一覧 |
| `education` | 学歴情報 |

### Works タイプ

- **`standard`**: ヒーロー画像 + キーポイント + テックスタック（通常の作品紹介）
- **`product-grid`**: 複数プロダクトのグリッド表示 + イテレーション写真（製品・プロトタイピング紹介）

### HTML 対応フィールド

以下のフィールドでは `<br>` 等の HTML タグが使用可能です:

- `profile.name.formatted`
- `profile.philosophy.headline`
- `profile.philosophy.body`

## ファイル構成

```
index.html              ← テンプレート（編集不要）
renderer.js             ← レンダラー（編集不要）
portfolio.config.json   ← ここを編集
README.md
*.png / *.jpg           ← 作品画像
```

## 技術仕様

- ビルドツール不要（純粋な HTML/CSS/JS）
- GitHub Pages 対応
- A4 印刷 / PDF エクスポート対応
- Google Fonts: DM Sans, Syne
