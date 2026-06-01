
import React, { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string, mimeType: string) => void;
  onImageClear: () => void;
  disabled: boolean;
  uploadedImagePreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onImageClear, disabled, uploadedImagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result!.toString().split(',')[1], file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageUpload(reader.result!.toString().split(',')[1], file.type);
        };
        reader.readAsDataURL(file);
    }
  }, [onImageUpload, disabled]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
     if (!disabled) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };


  if (uploadedImagePreview) {
    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="relative group">
          <img src={uploadedImagePreview} alt="Uploaded preview" className="rounded-lg w-full object-contain max-h-96" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <button
              onClick={onImageClear}
              disabled={disabled}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Remove Image
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
        <div
            onClick={handleUploadClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-all duration-300
            ${disabled 
                ? 'border-gray-700 bg-gray-800/30 text-gray-600 cursor-not-allowed' 
                : 'border-gray-600 hover:border-pink-400 hover:bg-gray-800/50 text-gray-400 cursor-pointer'
            }
            ${isDragging ? 'border-pink-400 bg-gray-800/50 ring-4 ring-pink-500/20' : ''}
            `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                disabled={disabled}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm">PNG, JPG or WEBP</p>
        </div>
    </div>
  );
};

export default ImageUploader;
