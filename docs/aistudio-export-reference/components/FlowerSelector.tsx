
import React from 'react';
import { Flower } from '../types';
import { FLOWERS } from '../constants';

interface FlowerSelectorProps {
  selectedFlower: Flower | null;
  onSelectFlower: (flower: Flower) => void;
  disabled: boolean;
}

const FlowerSelector: React.FC<FlowerSelectorProps> = ({ selectedFlower, onSelectFlower, disabled }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-semibold text-center mb-6 text-pink-300">2. Select a Flower</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {FLOWERS.map((flower) => (
          <button
            key={flower.name}
            disabled={disabled}
            onClick={() => onSelectFlower(flower)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50
              ${selectedFlower?.name === flower.name
                ? 'bg-pink-500/20 border-pink-400 shadow-lg shadow-pink-500/20'
                // FIX: Replaced `-` with `:` in the ternary operator for conditional class rendering.
                : 'bg-gray-800/50 border-gray-700 hover:border-pink-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span className="text-4xl mb-2">{flower.icon}</span>
            <span className="text-center font-medium text-sm text-gray-200">{flower.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlowerSelector;
