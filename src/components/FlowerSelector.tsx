"use client";

import { FLOWERS, FLOWER_LABELS } from "@/lib/flowers";
import type { Flower } from "@/types/flower";

type FlowerSelectorProps = {
  selectedFlower: Flower | null;
  onSelectFlower: (flower: Flower) => void;
  disabled: boolean;
};

export function FlowerSelector({ selectedFlower, onSelectFlower, disabled }: FlowerSelectorProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        {FLOWERS.map((flower) => {
          const active = selectedFlower?.id === flower.id;
          const label = FLOWER_LABELS[flower.id] ?? `${flower.flower} (${flower.country})`;
          return (
            <button
              key={flower.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectFlower(flower)}
              className={`flex min-h-[5.5rem] flex-col items-center justify-center rounded-2xl border-2 p-3 transition active:scale-[0.98] text-left ${
                active
                  ? "border-pink-400 bg-pink-50 shadow-lg shadow-pink-200"
                  : "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50/50"
              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <span className="mb-1 text-2xl">{label.split(" ")[0]}</span>
              <span className="text-center text-xs font-medium leading-tight text-gray-700">
                {label.replace(/^[^\s]+ /, "")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
