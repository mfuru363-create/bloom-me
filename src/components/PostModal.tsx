"use client";

import { useEffect, useState } from "react";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | null;
  flowerName: string;
  onCreatePost: (caption: string, author: string) => void;
}

export default function PostModal({
  isOpen,
  onClose,
  image,
  flowerName,
  onCreatePost,
}: PostModalProps) {
  const [caption, setCaption] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAuthor(`${flowerName} Spirit`);
      setCaption("");
    }
  }, [isOpen, flowerName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen || !image) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePost(caption, author || `${flowerName} Spirit`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="post-modal-title" className="text-2xl font-bold text-gray-800">
            Share Your Creation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Preview"
            className="w-full h-auto max-h-64 object-contain rounded-md bg-gray-100"
          />

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author Name
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={`${flowerName} Spirit`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-base"
            />
          </div>

          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Add a caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={`My ${flowerName} Spirit is feeling...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-base"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-md hover:from-pink-600 hover:to-rose-700 transition-all shadow-sm font-medium min-h-[44px]"
            >
              Post to Feed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
