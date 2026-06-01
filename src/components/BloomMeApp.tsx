"use client";

import { useCallback, useState } from "react";
import { CharacterDisplay } from "@/components/CharacterDisplay";
import { FlowerSelector } from "@/components/FlowerSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { APP_NAME } from "@/lib/config";
import type { Character, Flower, UploadedImage } from "@/types/flower";

export function BloomMeApp() {
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedCharacter, setGeneratedCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const previewUrl = uploadedImage
    ? `data:${uploadedImage.mimeType};base64,${uploadedImage.data}`
    : null;

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) {
      setError("先に写真をアップロードしてください");
      return;
    }
    if (!selectedFlower) {
      setError("花を選んでください");
      return;
    }

    setError(null);
    setIsLoading(true);
    setGeneratedCharacter(null);

    try {
      setLoadingMessage("種をまいています…キャラクター設定を生成中");
      const charRes = await fetch("/api/generate-character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flower: selectedFlower, userPrompt }),
      });
      const charData = (await charRes.json()) as {
        name?: string;
        description?: string;
        error?: string;
      };
      if (!charRes.ok) throw new Error(charData.error ?? "キャラクター生成に失敗");

      setLoadingMessage("花びらに水をあげています…画像を変身させています");
      const imgRes = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: charData.name,
          description: charData.description,
          flowerName: selectedFlower.name,
          base64ImageData: uploadedImage.data,
          mimeType: uploadedImage.mimeType,
        }),
      });
      const imgData = (await imgRes.json()) as {
        imageBase64?: string;
        error?: string;
      };
      if (!imgRes.ok) throw new Error(imgData.error ?? "画像生成に失敗");

      setLoadingMessage("花が咲きました！");
      setGeneratedCharacter({
        name: charData.name!,
        description: charData.description!,
        imageUrl: `data:image/png;base64,${imgData.imageBase64}`,
        flowerName: selectedFlower.name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期しないエラーが発生しました");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }, [selectedFlower, userPrompt, uploadedImage]);

  const handleReset = () => {
    setSelectedFlower(null);
    setUploadedImage(null);
    setUserPrompt("");
    setGeneratedCharacter(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner message={loadingMessage} />;
    if (generatedCharacter) {
      return <CharacterDisplay character={generatedCharacter} onReset={handleReset} />;
    }

    return (
      <div className="mx-auto w-full max-w-4xl animate-fade-in space-y-10 px-1 md:space-y-12">
        <section>
          <h2 className="mb-4 text-center text-lg font-semibold text-pink-300 md:text-xl">
            1. 写真をアップロード
          </h2>
          <ImageUploader
            onImageUpload={(data, mimeType) => setUploadedImage({ data, mimeType })}
            onImageClear={() => setUploadedImage(null)}
            disabled={isLoading}
            uploadedImagePreview={previewUrl}
          />
        </section>

        <FlowerSelector
          selectedFlower={selectedFlower}
          onSelectFlower={setSelectedFlower}
          disabled={isLoading}
        />

        <section>
          <h2 className="mb-4 text-center text-lg font-semibold text-purple-300 md:text-xl">
            3. ひとこと添える（任意）
          </h2>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="例：「優しい心を持つ戦士」「星を読む学者」"
            className="min-h-28 w-full rounded-2xl border-2 border-gray-700 bg-gray-800/50 p-4 text-base text-gray-200 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30"
            disabled={isLoading}
          />
        </section>

        <div className="pb-4 text-center">
          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={!selectedFlower || !uploadedImage || isLoading}
            className="min-h-14 w-full max-w-md rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-10 text-lg font-bold text-white shadow-lg transition active:scale-[0.99] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            Bloom Your Character
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-[100dvh] bg-gray-900 text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at top right, rgba(192, 132, 252, 0.12), transparent 40%), radial-gradient(circle at bottom left, rgba(244, 114, 182, 0.12), transparent 50%)",
      }}
    >
      <header className="px-4 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] text-center md:py-8">
        <h1 className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          {APP_NAME}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-gray-300 md:text-lg">
          花の精霊に変身する
          <br className="sm:hidden" />
          タイムスリップ体験
        </p>
      </header>

      <main className="container mx-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {error && (
          <div className="mx-auto mb-6 max-w-4xl rounded-2xl border border-red-500 bg-red-500/20 p-4 text-center text-red-200">
            {error}
          </div>
        )}
        {renderContent()}
      </main>

      <footer className="py-6 text-center text-xs text-gray-500">
        BLOOM Me — Flower Spirit Generator
      </footer>
    </div>
  );
}
