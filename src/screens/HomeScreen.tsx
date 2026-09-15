"use client";

import type { AppTheme, HomeEnterPayload } from "@/types/app";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1589327329571-7024f0a7a402?q=80&w=1974&auto=format&fit=crop";

interface HomeScreenProps {
  onEnter: (payload: HomeEnterPayload) => void;
}

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  const enter = (gender: AppTheme) => onEnter({ gender });

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center text-white p-4"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      <div className="text-center bg-black/40 p-8 md:p-12 rounded-2xl backdrop-blur-md shadow-2xl max-w-lg w-full">
        <h1
          className="text-5xl md:text-7xl font-bold"
          style={{
            fontFamily: "var(--font-playfair), serif",
            color: "#FFD700",
            textShadow: "2px 2px 4px #000, 0 0 20px #000",
          }}
        >
          BLOOM Me
        </h1>
        <p className="mt-4 text-base md:text-lg text-yellow-100 opacity-90 leading-relaxed">
          歴史の美しい時代から、
          <br className="sm:hidden" />
          花の精霊として生まれ変わろう
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={() => enter("female")}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300 min-h-[48px]"
          >
            女性の精霊
          </button>
          <button
            type="button"
            onClick={() => enter("male")}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-sky-300 min-h-[48px]"
          >
            男性の精霊
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-300">
          ※ 高品質モードは1日1回まで利用できます
        </p>
      </div>
    </div>
  );
}
