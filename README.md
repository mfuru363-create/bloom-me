# BLOOM Me

花の精霊に変身する AI 体験アプリ（スマホファースト・PC 対応）

> AI Studio エクスポート（`copy-of-bloom-me２_-ai-flower-spirit-generator`）を Next.js + Vercel 向けに移植。

## 機能

1. 写真をアップロード
2. 国花10種から花を選択
3. 任意のプロンプトを入力
4. **Bloom Your Character** — AI がキャラ設定＋アニメ風画像を生成

## 技術スタック

- Next.js 16 (App Router) + TypeScript + Tailwind
- `@google/genai`（サーバー側のみ）
- Vercel デプロイ想定
- Firebase **不使用**

## セットアップ

```bash
cd bloom-me
npm install
cp .env.example .env.local
```

`.env.local` に以下を設定:

```
GEMINI_API_KEY=あなたのキー
```

```bash
npm run dev
```

http://localhost:3000

## API

| エンドポイント | 用途 |
|----------------|------|
| `POST /api/generate-character` | キャラ名前・説明文 |
| `POST /api/generate-image` | 画像変身（base64 返却） |

## デプロイ（Vercel）

1. GitHub に push（下記）
2. [vercel.com](https://vercel.com) → Import Repository
3. Environment Variables: `GEMINI_API_KEY`
4. Deploy

## GitHub（初回）

```bash
# GitHub で bloom-me リポジトリを作成後
git remote add origin https://github.com/YOUR_USER/bloom-me.git
git push -u origin main
```

## フォルダ

```
src/components/BloomMeApp.tsx   メイン UI
src/lib/flowers.ts              国花10種
src/lib/gemini-server.ts        Gemini 呼び出し
docs/aistudio-export-reference/ 元 AI Studio コード（参照用）
public/                         BGM・画像アセット
```

## 譲渡（滝澤さん向け）

- リポジトリオーナー移管
- Vercel プロジェクト移管
- `GEMINI_API_KEY` を依頼者名義に差し替え

詳細: Obsidian `05_projects/BLOOM Me/`
