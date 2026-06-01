# BLOOM Me

タイムスリップ変身体験 Web アプリ（スマホファースト・PC 対応）

## 技術スタック

- **Next.js** (App Router)
- **Tailwind CSS**
- **Vercel** デプロイ想定
- **Gemini API**（サーバー側 `/api/chat` 経由）

Firebase は使用しません。

## 初回セットアップ

```bash
cd bloom-me
npm install
cp .env.example .env.local
# .env.local に GEMINI_API_KEY を設定
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## 環境変数

| 変数 | 必須 | 説明 |
|------|:----:|------|
| `GEMINI_API_KEY` | ✅ | Google AI Studio の API キー |
| `GEMINI_MODEL` | — | 既定: `gemini-2.0-flash` |

## デプロイ（Vercel）

1. GitHub にリポジトリを push
2. [Vercel](https://vercel.com) → **Add New Project** → リポジトリを Import
3. Environment Variables に `GEMINI_API_KEY` を追加
4. Deploy

## フォルダ構成

```
public/
  bgm/           BGM（main-theme.mp3 など）
  images/        背景画像（female / male）
  video/         動画アセット
src/
  app/api/chat/  Gemini プロキシ
  components/    HomeScreen, ChatScreen
  lib/config.ts  テーマ・アセットパス
```

## 譲渡時メモ

- GitHub リポジトリオーナーを依頼者へ移管
- Vercel プロジェクトを依頼者アカウントへ移管
- `GEMINI_API_KEY` を依頼者名義のキーに差し替え

詳細ドキュメント: Obsidian `05_projects/BLOOM Me/`

## 開発

```bash
npm run dev      # 開発サーバー
npm run build    # 本番ビルド
npm run lint     # ESLint
```

## ライセンス

Private — 滝澤さん依頼プロジェクト
