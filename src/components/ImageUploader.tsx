"use client";

import { useCallback, useRef, useState } from "react";

type ImageUploaderProps = {
  onImageUpload: (base64: string, mimeType: string) => void;
  onImageClear: () => void;
  disabled: boolean;
  uploadedImagePreview: string | null;
};

export function ImageUploader({
  onImageUpload,
  onImageClear,
  disabled,
  uploadedImagePreview,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString() ?? "";
      const base64 = result.split(",")[1];
      if (base64) onImageUpload(base64, file.type);
    };
    reader.readAsDataURL(file);
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
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled && e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition ${
          disabled
            ? "cursor-not-allowed border-gray-700 bg-gray-800/30 text-gray-600"
            : "cursor-pointer border-gray-600 text-gray-400 hover:border-pink-400 hover:bg-gray-800/50"
        } ${isDragging ? "border-pink-400 bg-gray-800/50 ring-4 ring-pink-500/20" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
        />
        <span className="mb-2 text-4xl">📷</span>
        <p className="text-base font-semibold">タップして写真を選ぶ</p>
        <p className="mt-1 text-sm">PNG / JPG / WEBP</p>
      </div>
    </div>
  );
}
