"use client";

import { useEffect, useRef, useState } from "react";
import type { AppTheme, HomeEnterPayload } from "@/types/app";
import { APP_NAME, BGM_URL, THEME_CONFIG } from "@/lib/config";

type HomeScreenProps = {
  onEnter: (payload: HomeEnterPayload) => void;
};

export function HomeScreen({ onEnter }: HomeScreenProps) {
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState<AppTheme>("female");
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const theme = THEME_CONFIG[gender];

  useEffect(() => {
    audioRef.current = new Audio(BGM_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.45;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleBgm = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (bgmEnabled) {
      audio.pause();
      setBgmEnabled(false);
      return;
    }

    try {
      await audio.play();
      setBgmEnabled(true);
    } catch {
      setBgmEnabled(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) return;
    onEnter({ userName: trimmed, gender });
  };

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
      style={{ backgroundColor: theme.accentMuted }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${theme.backgroundImage})` }}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${theme.gradient}`}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))] md:max-w-xl md:px-8 md:py-10 lg:max-w-2xl">
        <header className="mb-8 text-center md:mb-10">
          <p className="text-sm font-medium tracking-[0.2em] text-black/50">
            TIMESLIP
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-black/85 md:text-4xl">
            {APP_NAME}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-black/65">
            タイムスリップ変身体験へ
            <br className="sm:hidden" />
            ようこそ
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-auto flex flex-col gap-5 rounded-3xl border border-white/60 bg-white/75 p-5 shadow-lg backdrop-blur-md md:p-7"
        >
          <div>
            <label
              htmlFor="userName"
              className="mb-2 block text-sm font-semibold text-black/70"
            >
              お名前
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="なまえを入力"
              autoComplete="nickname"
              className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-base text-black/85 outline-none ring-offset-2 placeholder:text-black/35 focus:border-black/25 focus:ring-2 focus:ring-black/10"
            />
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-black/70">
              テーマ
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(THEME_CONFIG) as AppTheme[]).map((key) => {
                const active = gender === key;
                const item = THEME_CONFIG[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setGender(key)}
                    className={`min-h-12 rounded-2xl border px-4 text-base font-semibold transition ${
                      active
                        ? "border-black/20 bg-white text-black shadow-sm"
                        : "border-transparent bg-black/5 text-black/60"
                    }`}
                    style={
                      active
                        ? { boxShadow: `0 0 0 2px ${item.accent}` }
                        : undefined
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={toggleBgm}
            className="min-h-12 rounded-2xl border border-black/10 bg-white/80 px-4 text-base font-medium text-black/70"
          >
            {bgmEnabled ? "🔊 BGM 停止" : "🔈 BGM 再生（タップ）"}
          </button>

          <button
            type="submit"
            disabled={!userName.trim()}
            className="min-h-14 rounded-2xl text-lg font-bold text-white shadow-md transition enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
            style={{ backgroundColor: theme.accent }}
          >
            はじめる
          </button>
        </form>
      </div>
    </section>
  );
}
