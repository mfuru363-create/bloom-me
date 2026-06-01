"use client";

import { FLOWERS, FLOWER_LABELS } from "@/lib/flowers";
import type { Flower } from "@/types/flower";

type FlowerSelectorProps = {
  selectedFlower: Flower | null;
  onSelectFlower: (flower: Flower) => void;
  disabled: boolean;
};

export function FlowerSelector({
  selectedFlower,
  onSelectFlower,
  disabled,
}: FlowerSelectorProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-1">
      <h2 className="mb-4 text-center text-lg font-semibold text-pink-300 md:text-xl">
        2. 花を選ぶ
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        {FLOWERS.map((flower) => {
          const active = selectedFlower?.name === flower.name;
          return (
            <button
              key={flower.name}
              type="button"
              disabled={disabled}
              onClick={() => onSelectFlower(flower)}
              className={`flex min-h-[5.5rem] flex-col items-center justify-center rounded-2xl border-2 p-3 transition active:scale-[0.98] ${
                active
                  ? "border-pink-400 bg-pink-500/20 shadow-lg shadow-pink-500/20"
                  : "border-gray-700 bg-gray-800/50 hover:border-pink-300"
              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <span className="mb-1 text-3xl md:text-4xl">{flower.icon}</span>
              <span className="text-center text-xs font-medium leading-tight text-gray-200 md:text-sm">
                {FLOWER_LABELS[flower.name] ?? flower.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
