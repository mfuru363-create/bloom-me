#!/usr/bin/env bash
# BLOOM Me — GitHub リポジトリ作成 & 初回 push
# 使い方:
#   1. gh auth login   （初回のみ）
#   2. ./scripts/setup-github.sh
#   または: ./scripts/setup-github.sh --private

set -euo pipefail

REPO_NAME="bloom-me"
VISIBILITY="public"
if [[ "${1:-}" == "--private" ]]; then
  VISIBILITY="private"
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ gh (GitHub CLI) が見つかりません。"
  echo "   インストール: https://cli.github.com/"
  echo "   または README の「手動でリポジトリ作成」を参照してください。"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "❌ GitHub にログインしていません。"
  echo "   次を実行してください:  gh auth login"
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "ℹ️  remote origin は既に設定されています:"
  git remote -v
  read -r -p "上書きして push しますか? [y/N] " ans
  if [[ "${ans:-}" != "y" && "${ans:-}" != "Y" ]]; then
    exit 0
  fi
  git remote remove origin
fi

echo "📦 リポジトリ作成: ${REPO_NAME} (${VISIBILITY})"
gh repo create "$REPO_NAME" \
  --"$VISIBILITY" \
  --source=. \
  --remote=origin \
  --description="BLOOM Me — 花の精霊 AI 変身アプリ（スマホファースト）" \
  --push

echo ""
echo "✅ 完了!"
gh repo view --web 2>/dev/null || true
