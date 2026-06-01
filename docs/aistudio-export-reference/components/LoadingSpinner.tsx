
import React from 'react';

interface LoadingSpinnerProps {
    message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 border-4 border-pink-300/20 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-pink-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
          🌸
        </div>
      </div>
      <p className="text-lg text-gray-300 font-semibold">{message}</p>
      <p className="text-sm text-gray-400 mt-2">This magical process can take a moment...</p>
    </div>
  );
};

export default LoadingSpinner;
