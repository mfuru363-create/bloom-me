"use client";

import type { AppTheme } from "@/types/app";
import { THEME_UI } from "@/lib/config";

interface ImagePreviewProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
  gender: AppTheme;
}

function Spinner({ gender }: { gender: AppTheme }) {
  const ui = THEME_UI[gender];
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <svg className={`animate-spin h-12 w-12 ${ui.spinner}`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-gray-600 text-lg">花の精霊が咲いています...</p>
      <p className="text-sm text-gray-500">30秒ほどお待ちください</p>
    </div>
  );
}

export default function ImagePreview({ image, isLoading, error, onReset, gender }: ImagePreviewProps) {
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = `bloom-me-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-sm rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
      <div className="aspect-square w-full flex items-center justify-center min-h-64">
        {isLoading && <Spinner gender={gender} />}

        {!isLoading && error && (
          <div className="text-center text-red-600 p-4">
            <h3 className="text-xl font-bold mb-2">生成に失敗しました</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt="生成された花の精霊"
            className="w-full h-full object-contain rounded-md"
          />
        )}

        {!isLoading && !error && !image && (
          <div className="text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-4 text-lg">ここに生成画像が表示されます</p>
            <p className="text-sm">花を選んでカスタマイズし、生成ボタンを押してください</p>
          </div>
        )}
      </div>

      {!isLoading && !error && image && (
        <div className="w-full pt-4 mt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 flex justify-center items-center py-2 px-4 rounded-md shadow-sm text-md font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 min-h-[44px]"
          >
            画像を保存
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex-1 flex justify-center items-center py-2 px-4 rounded-md shadow-sm text-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 min-h-[44px]"
          >
            もう一度つくる
          </button>
        </div>
      )}
    </div>
  );
}
