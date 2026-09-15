"use client";

import { useRef, useState } from "react";
import { MAX_IMAGE_DIMENSION, resizeImageForUpload } from "@/lib/resize-image";
import { THEME_UI } from "@/lib/config";
import type { AppTheme } from "@/types/app";

type ImageUploaderProps = {
  onImageUpload: (base64: string, mimeType: string) => void;
  onImageClear: () => void;
  disabled: boolean;
  uploadedImagePreview: string | null;
  gender: AppTheme;
};

export function ImageUploader({
  onImageUpload,
  onImageClear,
  disabled,
  uploadedImagePreview,
  gender,
}: ImageUploaderProps) {
  const ui = THEME_UI[gender];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const readFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setIsProcessing(true);
    setProcessError(null);
    try {
      const { base64, mimeType } = await resizeImageForUpload(file);
      onImageUpload(base64, mimeType);
    } catch {
      setProcessError("画像の処理に失敗しました。別の写真をお試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  if (uploadedImagePreview) {
    return (
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="group relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={uploadedImagePreview}
            alt="アップロード画像"
            className="max-h-80 w-full rounded-2xl object-contain md:max-h-96"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={onImageClear}
              disabled={disabled}
              className="min-h-12 rounded-full bg-red-600 px-6 text-base font-bold text-white disabled:opacity-50"
            >
              画像を削除
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          送信時は長辺 {MAX_IMAGE_DIMENSION}px に自動圧縮されます
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && !isProcessing && fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled && !isProcessing && e.dataTransfer.files[0]) {
            void readFile(e.dataTransfer.files[0]);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition ${
          disabled || isProcessing
            ? "cursor-not-allowed border-gray-300 bg-gray-50 text-gray-400"
            : ui.uploader
        } ${isDragging ? ui.uploaderDragging : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={disabled || isProcessing}
          onChange={(e) => e.target.files?.[0] && void readFile(e.target.files[0])}
        />
        {isProcessing ? (
          <>
            <span className="mb-2 text-4xl animate-pulse">⏳</span>
            <p className="text-base font-semibold">画像を圧縮中...</p>
          </>
        ) : (
          <>
            <span className="mb-2 text-4xl">📷</span>
            <p className="text-base font-semibold">タップして写真を選ぶ</p>
            <p className="mt-1 text-sm">PNG / JPG / WEBP</p>
            <p className="mt-2 text-xs text-gray-400">
              自動で長辺 {MAX_IMAGE_DIMENSION}px に圧縮されます
            </p>
          </>
        )}
      </div>
      {processError && <p className="mt-2 text-center text-sm text-red-600">{processError}</p>}
    </div>
  );
}
