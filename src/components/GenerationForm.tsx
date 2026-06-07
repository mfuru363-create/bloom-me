"use client";

import { useEffect, useState } from "react";
import type { Flower } from "@/types/flower";

export interface FormState {
  personality: string;
  outfit: string;
  background: string;
  color_tone: string;
  quality: "standard" | "high";
}

interface GenerationFormProps {
  flower: Flower;
  onGenerate: (formState: FormState) => void;
  isLoading: boolean;
}

function InputField({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-colors text-base"
      />
    </div>
  );
}

export default function GenerationForm({ flower, onGenerate, isLoading }: GenerationFormProps) {
  const [formState, setFormState] = useState<FormState>({
    personality: "calm, graceful",
    outfit: flower.defaultOutfit,
    background: flower.theme,
    color_tone: "warm, gentle",
    quality: "standard",
  });

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      outfit: flower.defaultOutfit,
      background: flower.theme,
    }));
  }, [flower]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formState);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generation Quality
        </label>
        <div className="flex p-1 bg-gray-100 rounded-lg w-full">
          {(["standard", "high"] as const).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setFormState((s) => ({ ...s, quality: q }))}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                formState.quality === q
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {q === "standard" ? "Standard" : "Real-Image Quality"}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {formState.quality === "standard"
            ? "Standard mode creates a beautiful fantasy art style."
            : "Real-Image Quality creates a highly detailed, photorealistic result."}
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-4">
        <InputField
          label="Personality (comma-separated)"
          id="personality"
          value={formState.personality}
          onChange={handleChange}
        />
        <InputField label="Outfit" id="outfit" value={formState.outfit} onChange={handleChange} />
        <InputField
          label="Background"
          id="background"
          value={formState.background}
          onChange={handleChange}
        />
        <InputField
          label="Color Tone"
          id="color_tone"
          value={formState.color_tone}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed transition-all duration-300 mt-6 min-h-[48px]"
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
            Generating...
          </>
        ) : (
          "Bloom Your Spirit!"
        )}
      </button>
    </form>
  );
}
