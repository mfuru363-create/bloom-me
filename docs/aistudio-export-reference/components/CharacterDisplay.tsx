
import React from 'react';
import { Character } from '../types';

interface CharacterDisplayProps {
  character: Character;
  onReset: () => void;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ character, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <div className="bg-gray-800/50 rounded-2xl shadow-2xl shadow-purple-500/10 backdrop-blur-sm overflow-hidden border border-gray-700">
        <div className="md:flex">
          <div className="md:w-1/2">
              <img
                  src={character.imageUrl}
                  alt={`AI generated character: ${character.name}`}
                  className="object-cover w-full h-full"
              />
          </div>
          <div className="p-6 md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="uppercase tracking-wide text-sm text-pink-400 font-bold">
                {character.flowerName} Spirit
              </div>
              <h3 className="block mt-1 text-3xl leading-tight font-bold text-white mb-2">
                {character.name}
              </h3>
              <p className="mt-4 text-gray-300 whitespace-pre-wrap">{character.description}</p>
            </div>
            <div className="mt-6 text-center">
                <button 
                  onClick={onReset}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50"
                >
                  Create Another
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDisplay;
