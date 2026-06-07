"use client";

import { useCallback, useState } from "react";
import type { Flower } from "@/types/flower";
import { FLOWERS } from "@/lib/flowers";
import { FlowerSelector } from "@/components/FlowerSelector";
import { ImageUploader } from "@/components/ImageUploader";
import GenerationForm, { type FormState } from "@/components/GenerationForm";
import ImagePreview from "@/components/ImagePreview";
import PostModal from "@/components/PostModal";

interface GeneratorScreenProps {
  onImageGenerated: (image: string | null) => void;
  newlyGeneratedImage: string | null;
  onCreatePost: (caption: string, author: string) => void;
}

export default function GeneratorScreen({
  onImageGenerated,
  newlyGeneratedImage,
  onCreatePost,
}: GeneratorScreenProps) {
  const [selectedFlower, setSelectedFlower] = useState<Flower>(FLOWERS[0]);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const previewUrl = uploadedImage
    ? `data:${uploadedImage.mimeType};base64,${uploadedImage.data}`
    : null;

  const handleGenerate = useCallback(
    async (formState: FormState) => {
      setIsLoading(true);
      setError(null);
      onImageGenerated(null);

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
          }),
        });

        const data = (await res.json()) as { imageBase64?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? "生成に失敗しました");

        onImageGenerated(`data:image/png;base64,${data.imageBase64}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "予期しないエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedFlower, uploadedImage, onImageGenerated]
  );

  const handlePostCreation = useCallback(
    (caption: string, author: string) => {
      onCreatePost(caption, author);
      setIsPostModalOpen(false);
    },
    [onCreatePost]
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              1. Select a National Flower
            </h2>
            <FlowerSelector
              selectedFlower={selectedFlower}
              onSelectFlower={setSelectedFlower}
              disabled={isLoading}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              2. Transform from a Photo{" "}
              <span className="text-base font-normal">(Optional)</span>
            </h2>
            <ImageUploader
              onImageUpload={(base64, mimeType) => setUploadedImage({ data: base64, mimeType })}
              onImageClear={() => setUploadedImage(null)}
              disabled={isLoading}
              uploadedImagePreview={previewUrl}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              3. Customize Your Spirit
            </h2>
            <GenerationForm
              flower={selectedFlower}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </section>
        </div>

        <div className="lg:sticky lg:top-28">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            4. Behold Your Creation
          </h2>
          <ImagePreview
            image={newlyGeneratedImage}
            isLoading={isLoading}
            error={error}
            onOpenPostModal={() => setIsPostModalOpen(true)}
          />
        </div>
      </div>

      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        image={newlyGeneratedImage}
        flowerName={selectedFlower.flower}
        onCreatePost={handlePostCreation}
      />
    </>
  );
}
