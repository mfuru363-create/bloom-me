"use client";

import type { Character } from "@/types/flower";

type CharacterDisplayProps = {
  character: Character;
  onReset: () => void;
};

export function CharacterDisplay({ character, onReset }: CharacterDisplayProps) {
  return (
    <div className="mx-auto w-full max-w-4xl animate-fade-in px-1">
      <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50 shadow-2xl shadow-purple-500/10 backdrop-blur-sm md:rounded-3xl">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={character.imageUrl}
              alt={`生成キャラクター: ${character.name}`}
              className="h-auto max-h-[28rem] w-full object-cover md:max-h-none md:min-h-full"
            />
          </div>
          <div className="flex flex-col justify-between p-5 md:w-1/2 md:p-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-pink-400">
                {character.flowerName} Spirit
              </p>
              <h3 className="mt-1 text-2xl font-bold leading-tight text-white md:text-3xl">
                {character.name}
              </h3>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-gray-300">
                {character.description}
              </p>
            </div>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onReset}
                className="min-h-14 w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 text-lg font-bold text-white shadow-lg transition active:scale-[0.99] md:w-auto"
              >
                もう一度つくる
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
