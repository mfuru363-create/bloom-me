"use client";

import { useEffect, useState } from "react";
import type { AppTheme } from "@/types/app";
import type { Flower } from "@/types/flower";
import type { GenerationLimits } from "@/lib/rate-limit-config";
import { THEME_UI } from "@/lib/config";

export interface FormState {
  personality: string;
  outfit: string;
  background: string;
  color_tone: string;
  quality: "standard" | "high";
}

interface GenerationFormProps {
  flower: Flower;
  gender: AppTheme;
  onGenerate: (formState: FormState) => void;
  isLoading: boolean;
  limits: GenerationLimits;
}

function InputField({
  label,
  id,
  value,
  onChange,
  placeholder,
  focusRing,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  focusRing: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${focusRing} transition-colors text-base`}
      />
    </div>
  );
}

export default function GenerationForm({
  flower,
  gender,
  onGenerate,
  isLoading,
  limits,
}: GenerationFormProps) {
  const ui = THEME_UI[gender];
  const [formState, setFormState] = useState<FormState>({
    personality: "穏やか, 優雅",
    outfit: flower.outfits[gender],
    background: flower.theme,
    color_tone: "温かく, やさしい",
    quality: "standard",
  });

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      outfit: flower.outfits[gender],
      background: flower.theme,
    }));
  }, [flower, gender]);

  useEffect(() => {
    if (!limits.highQualityAvailable && formState.quality === "high") {
      setFormState((prev) => ({ ...prev, quality: "standard" }));
    }
  }, [limits.highQualityAvailable, formState.quality]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formState);
  };

  const isCooldown = limits.cooldownRemainingSec > 0;
  const submitDisabled = isLoading || isCooldown;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          生成クオリティ
        </label>
        <div className="flex p-1 bg-gray-100 rounded-lg w-full">
          {(["standard", "high"] as const).map((q) => {
            const isHighDisabled = q === "high" && !limits.highQualityAvailable;
            return (
              <button
                key={q}
                type="button"
                disabled={isHighDisabled}
                onClick={() => !isHighDisabled && setFormState((s) => ({ ...s, quality: q }))}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  formState.quality === q
                    ? ui.qualityActive
                    : isHighDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {q === "standard" ? "スタンダード" : "高品質（写実）"}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {formState.quality === "standard"
            ? "ファンタジー調のイラスト風（回数制限なし）"
            : "高精細・写実的な仕上がり（1日1回まで）"}
          {!limits.highQualityAvailable && (
            <span className="block mt-1 text-amber-600">
              高品質モードは本日分を使用済みです。明日またお試しください。
            </span>
          )}
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-4">
        <InputField
          label="性格（カンマ区切り）"
          id="personality"
          value={formState.personality}
          onChange={handleChange}
          placeholder="例：穏やか, 優雅, 情熱的"
          focusRing={ui.focusRing}
        />
        <InputField
          label="衣装"
          id="outfit"
          value={formState.outfit}
          onChange={handleChange}
          placeholder="精霊の衣装・装い"
          focusRing={ui.focusRing}
        />
        <InputField
          label="背景"
          id="background"
          value={formState.background}
          onChange={handleChange}
          placeholder="時代背景・シーン"
          focusRing={ui.focusRing}
        />
        <InputField
          label="色調・光"
          id="color_tone"
          value={formState.color_tone}
          onChange={handleChange}
          placeholder="例：温かく, やさしい"
          focusRing={ui.focusRing}
        />
      </div>

      <button
        type="submit"
        disabled={submitDisabled}
        className={`w-full flex justify-center items-center py-3 px-4 rounded-md shadow-sm text-lg font-medium text-white ${ui.submitButton} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed transition-all duration-300 mt-6 min-h-[48px]`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            生成中...
          </>
        ) : isCooldown ? (
          `${limits.cooldownRemainingSec} 秒後に再生成できます`
        ) : (
          "花の精霊に変身する"
        )}
      </button>
    </form>
  );
}
