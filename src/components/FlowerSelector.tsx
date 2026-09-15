"use client";

import { FLOWERS, FLOWER_LABELS } from "@/lib/flowers";
import { THEME_UI } from "@/lib/config";
import type { AppTheme } from "@/types/app";
import type { Flower } from "@/types/flower";

type FlowerSelectorProps = {
  selectedFlower: Flower | null;
  onSelectFlower: (flower: Flower) => void;
  disabled: boolean;
  gender: AppTheme;
};

export function FlowerSelector({
  selectedFlower,
  onSelectFlower,
  disabled,
  gender,
}: FlowerSelectorProps) {
  const ui = THEME_UI[gender];
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
                active ? ui.flowerSelected : ui.flowerIdle
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
