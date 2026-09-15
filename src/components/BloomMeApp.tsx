"use client";

import { useState } from "react";
import type { AppTheme, HomeEnterPayload } from "@/types/app";
import { THEME_UI } from "@/lib/config";
import HomeScreen from "@/screens/HomeScreen";
import GeneratorScreen from "@/screens/GeneratorScreen";

export function BloomMeApp() {
  const [activeScreen, setActiveScreen] = useState<"home" | "generator">("home");
  const [theme, setTheme] = useState<AppTheme | null>(null);

  const handleEnter = (payload: HomeEnterPayload) => {
    setTheme(payload.gender);
    setActiveScreen("generator");
  };

  const handleBackHome = () => {
    setTheme(null);
    setActiveScreen("home");
  };

  if (activeScreen === "home" || theme === null) {
    return <HomeScreen onEnter={handleEnter} />;
  }

  const ui = THEME_UI[theme];

  return (
    <div className={`min-h-screen ${ui.shellBg} text-gray-800`}>
      <header className="sticky top-0 z-10 p-4 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <button
            type="button"
            onClick={handleBackHome}
            className={`text-sm text-gray-500 ${ui.linkHover} transition-colors min-h-[44px] px-2`}
          >
            ← トップへ
          </button>
          <h1
            className={`text-2xl md:text-3xl font-bold ${ui.title}`}
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            BLOOM Me
          </h1>
          <div className="w-16" aria-hidden="true" />
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 max-w-5xl">
        <GeneratorScreen gender={theme} />
      </main>

      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Google Gemini で生成</p>
      </footer>
    </div>
  );
}
