# BLOOM Me UI 文言 — エクスポート / インポート

アクティブ UI の日本語文言を一覧化し、Google スプレッドシートで修正 → コードへ反映するワークフローです。

## ファイル

| ファイル | 用途 |
|----------|------|
| `strings-manifest.json` | 文言 ID・ファイル位置・検索文字列の正本 |
| `ui-strings.csv` | エクスポート一覧（修正欄付き） |
| `gas/Code.gs` | Google スプレッドシート用 GAS |
| `../../scripts/export-ui-strings.ts` | CSV 生成 |
| `../../scripts/import-ui-strings.ts` | 修正をコードへ反映 |

## 1. エクスポート

```bash
cd ~/dev/web/bloom-me
npm run i18n:export
```

出力先:

- `docs/i18n/ui-strings.csv`
- Obsidian `05_projects/02_BLOOM Me/テキスト一覧/ui-strings.csv`

## 2. Google スプレッドシートで修正

1. [Google スプレッドシート](https://sheets.google.com) を新規作成
2. **ファイル → インポート** → `ui-strings.csv` をアップロード
3. シート名を **`ui-strings`** に変更
4. **拡張機能 → Apps Script** → `gas/Code.gs` の内容を貼り付け → 保存
5. スプレッドシートを再読み込み
6. メニュー **BLOOM Me 文言 → リンク列を更新**
7. `text_revised` に修正文案を記入 → `status` を **`approved`** に

### テンプレート行の注意

`matchType=template` の行は、変数トークンを必ず残してください。

| id | 残すトークン例 |
|----|----------------|
| `form.submit.cooldown` | `${limits.cooldownRemainingSec}` |
| `error.api.cooldown` | `${cooldown.retryAfter}` |
| `uploader.compression.*` | `{MAX_IMAGE_DIMENSION}` |

## 3. インポート

承認済み CSV を `docs/i18n/ui-strings-approved.csv` に保存した場合:

```bash
npm run i18n:import -- --dry-run --input=docs/i18n/ui-strings-approved.csv
npm run i18n:import -- --input=docs/i18n/ui-strings-approved.csv
```

メイン CSV 上で `status=approved` にした場合:

```bash
npm run i18n:import -- --dry-run
npm run i18n:import
```

## 列定義

| 列 | 説明 |
|----|------|
| `id` | 安定キー（インポート用） |
| `link_local` | Cursor / VS Code で該当行を開く |
| `link_github` | GitHub 行リンク（push 後） |
| `text_current` | 現在の文言 |
| `text_revised` | 修正後（空欄 = 未修正） |
| `status` | `draft` / `approved` / `applied` |
