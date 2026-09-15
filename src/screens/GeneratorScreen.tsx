"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppTheme } from "@/types/app";
import type { Flower } from "@/types/flower";
import type { GenerationLimits } from "@/lib/rate-limit-config";
import { GENERATION_COOLDOWN_SEC, HIGH_QUALITY_DAILY_LIMIT } from "@/lib/rate-limit-config";
import { FLOWERS } from "@/lib/flowers";
import { FlowerSelector } from "@/components/FlowerSelector";
import { ImageUploader } from "@/components/ImageUploader";
import GenerationForm, { type FormState } from "@/components/GenerationForm";
import ImagePreview from "@/components/ImagePreview";

const DEFAULT_LIMITS: GenerationLimits = {
  cooldownRemainingSec: 0,
  highQualityAvailable: true,
  highQualityDailyLimit: HIGH_QUALITY_DAILY_LIMIT,
  cooldownSec: GENERATION_COOLDOWN_SEC,
};

type GeneratorScreenProps = {
  gender: AppTheme;
};

export default function GeneratorScreen({ gender }: GeneratorScreenProps) {
  const [selectedFlower, setSelectedFlower] = useState<Flower>(FLOWERS[0]);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limits, setLimits] = useState<GenerationLimits>(DEFAULT_LIMITS);

  const fetchLimits = useCallback(async () => {
    try {
      const res = await fetch("/api/generate-limits");
      if (res.ok) {
        const data = (await res.json()) as GenerationLimits;
        setLimits(data);
      }
    } catch {
      // サーバー側で最終ガード
    }
  }, []);

  useEffect(() => {
    void fetchLimits();
  }, [fetchLimits]);

  useEffect(() => {
    if (limits.cooldownRemainingSec <= 0) return;
    const timer = setInterval(() => {
      setLimits((prev) => ({
        ...prev,
        cooldownRemainingSec: Math.max(0, prev.cooldownRemainingSec - 1),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [limits.cooldownRemainingSec]);

  const previewUrl = uploadedImage
    ? `data:${uploadedImage.mimeType};base64,${uploadedImage.data}`
    : null;

  const handleGenerate = useCallback(
    async (formState: FormState) => {
      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);

      try {
        const res = await fetch("/api/generate-spirit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            flower: selectedFlower.flower,
            country: selectedFlower.country,
            hanakotoba: selectedFlower.hanakotoba,
            personality: formState.personality.split(",").map((p) => p.trim()).filter(Boolean),
            outfit: formState.outfit,
            background: formState.background,
            color_tone: formState.color_tone,
            userImage: uploadedImage,
            quality: formState.quality,
            gender,
          }),
        });

        const data = (await res.json()) as {
          imageBase64?: string;
          error?: string;
          retryAfter?: number;
          highQualityAvailable?: boolean;
        };

        if (!res.ok) {
          if (data.retryAfter) {
            setLimits((prev) => ({ ...prev, cooldownRemainingSec: data.retryAfter! }));
          }
          if (data.highQualityAvailable === false) {
            setLimits((prev) => ({ ...prev, highQualityAvailable: false }));
          }
          throw new Error(data.error ?? "生成に失敗しました");
        }

        setGeneratedImage(`data:image/png;base64,${data.imageBase64}`);
        void fetchLimits();
      } catch (err) {
        setError(err instanceof Error ? err.message : "予期しないエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedFlower, uploadedImage, fetchLimits, gender],
  );

  const handleReset = useCallback(() => {
    setGeneratedImage(null);
    setError(null);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            1. 国花を選ぶ
          </h2>
          <FlowerSelector
            selectedFlower={selectedFlower}
            onSelectFlower={setSelectedFlower}
            disabled={isLoading}
            gender={gender}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            2. 写真から変身{" "}
            <span className="text-base font-normal text-gray-500">（任意）</span>
          </h2>
          <ImageUploader
            onImageUpload={(base64, mimeType) => setUploadedImage({ data: base64, mimeType })}
            onImageClear={() => setUploadedImage(null)}
            disabled={isLoading}
            uploadedImagePreview={previewUrl}
            gender={gender}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            3. 精霊をカスタマイズ
          </h2>
          <GenerationForm
            flower={selectedFlower}
            gender={gender}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            limits={limits}
          />
        </section>
      </div>

      <div className="lg:sticky lg:top-28">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          4. 完成した精霊
        </h2>
        <ImagePreview
          image={generatedImage}
          isLoading={isLoading}
          error={error}
          onReset={handleReset}
          gender={gender}
        />
      </div>
    </div>
  );
}
