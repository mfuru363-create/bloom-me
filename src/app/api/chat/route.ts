import { NextRequest, NextResponse } from "next/server";
import type { AppTheme, ChatMessage } from "@/types/app";

type ChatRequestBody = {
  userName?: string;
  theme?: AppTheme;
  messages?: ChatMessage[];
};

const SYSTEM_PROMPT = `あなたは BLOOM Me のガイドAIです。
タイムスリップ変身体験を演出し、ユーザーを励まし、想像力を広げる短い日本語で返答してください。
返答は2〜4文程度、やさしく幻想的なトーンにしてください。`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY が設定されていません" },
      { status: 500 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userName = "ゲスト", theme = "female", messages = [] } = body;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  if (!lastUser) {
    return NextResponse.json({ error: "ユーザーメッセージがありません" }, { status: 400 });
  }

  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = [
    SYSTEM_PROMPT,
    `ユーザー名: ${userName}`,
    `テーマ: ${theme === "female" ? "女性向け" : "男性向け"}`,
    "",
    "会話履歴:",
    ...messages.map((m) => `${m.role === "user" ? "ユーザー" : "AI"}: ${m.content}`),
    "",
    "上記を踏まえ、最後のユーザーメッセージへ返答してください。",
  ].join("\n");

  const geminiRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return NextResponse.json(
      { error: `Gemini API error: ${errText.slice(0, 200)}` },
      { status: 502 },
    );
  }

  const data = (await geminiRes.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
    "少しだけ時間をください。もう一度お試しください。";

  return NextResponse.json({ reply });
}
