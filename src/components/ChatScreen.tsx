"use client";

import { useState } from "react";
import type { AppTheme, ChatMessage, HomeEnterPayload } from "@/types/app";
import { APP_NAME, THEME_CONFIG } from "@/lib/config";

type ChatScreenProps = HomeEnterPayload & {
  onBack: () => void;
};

export function ChatScreen({ userName, gender, onBack }: ChatScreenProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `${userName}さん、BLOOM Me へようこそ。今日はどんな変身をイメージしますか？`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const theme = THEME_CONFIG[gender];

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          theme: gender,
          messages: nextMessages,
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "チャットに失敗しました");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "…" },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "エラーが発生しました";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `（${message}。GEMINI_API_KEY を .env.local に設定してください）`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[100dvh] flex-col bg-neutral-950 text-white">
      <header
        className="sticky top-0 z-10 border-b border-white/10 px-4 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur md:px-6"
        style={{ backgroundColor: `${theme.accent}22` }}
      >
        <div className="mx-auto flex w-full max-w-lg items-center gap-3 md:max-w-2xl">
          <button
            type="button"
            onClick={onBack}
            className="min-h-11 min-w-11 rounded-full bg-white/10 px-3 text-sm"
          >
            ←
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white/60">{APP_NAME}</p>
            <h2 className="truncate text-lg font-semibold">{userName}</h2>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-medium text-black/80"
            style={{ backgroundColor: theme.accentMuted }}
          >
            {theme.label}
          </span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-4 md:max-w-2xl md:px-6 md:py-6 lg:max-w-3xl lg:flex-row lg:gap-8">
        <aside className="mb-4 hidden shrink-0 overflow-hidden rounded-3xl lg:block lg:w-72 lg:self-stretch">
          <div
            className="h-full min-h-[420px] bg-cover bg-center"
            style={{ backgroundImage: `url(${theme.backgroundImage})` }}
          />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
            {messages.map((msg, index) => (
              <li
                key={`${msg.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-base leading-relaxed md:max-w-[75%] ${
                  msg.role === "user"
                    ? "ml-auto bg-white text-black"
                    : "mr-auto bg-white/10 text-white"
                }`}
              >
                {msg.content}
              </li>
            ))}
            {loading && (
              <li className="mr-auto rounded-2xl bg-white/10 px-4 py-3 text-white/70">
                考え中…
              </li>
            )}
          </ul>

          <form
            className="sticky bottom-0 flex gap-2 border-t border-white/10 bg-neutral-950/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力"
              className="min-h-12 flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/40 focus:border-white/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="min-h-12 min-w-[4.5rem] rounded-2xl px-4 text-base font-semibold text-black disabled:opacity-40"
              style={{ backgroundColor: theme.accent }}
            >
              送信
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
