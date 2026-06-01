
import React, { useState, useCallback } from 'react';
import { Flower, Character } from './types';
import { generateCharacter, generateCharacterImage } from './services/geminiService';
import Header from './components/Header';
import FlowerSelector from './components/FlowerSelector';
import CharacterDisplay from './components/CharacterDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';

const App: React.FC = () => {
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [generatedCharacter, setGeneratedCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (data: string, mimeType: string) => {
    setUploadedImage({ data, mimeType });
  };
  
  const handleImageClear = () => {
    setUploadedImage(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) {
      setError('Please upload an image first.');
      return;
    }
    if (!selectedFlower) {
      setError('Please select a flower first.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedCharacter(null);

    try {
      setLoadingMessage('Planting the seed... generating character story...');
      const { name, description } = await generateCharacter(selectedFlower, userPrompt);

      setLoadingMessage('Watering the petals... transforming your image...');
      const imageBytes = await generateCharacterImage(name, description, selectedFlower.name, uploadedImage.data, uploadedImage.mimeType);
      const imageUrl = `data:image/png;base64,${imageBytes}`;

      setLoadingMessage('Your flower is blooming!');
      setGeneratedCharacter({
        name,
        description,
        imageUrl,
        flowerName: selectedFlower.name,
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [selectedFlower, userPrompt, uploadedImage]);

  const handleReset = () => {
    setSelectedFlower(null);
    setUploadedImage(null);
    setUserPrompt('');
    setGeneratedCharacter(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message={loadingMessage} />;
    }
    if (generatedCharacter) {
      return <CharacterDisplay character={generatedCharacter} onReset={handleReset} />;
    }
    return (
      <div className="w-full max-w-4xl mx-auto px-4 animate-fade-in space-y-12">
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-pink-300">1. Upload Your Image</h2>
            <ImageUploader
              onImageUpload={handleImageUpload}
              onImageClear={handleImageClear}
              disabled={isLoading}
              uploadedImagePreview={uploadedImage ? `data:${uploadedImage.mimeType};base64,${uploadedImage.data}` : null}
            />
        </div>
        
        <FlowerSelector selectedFlower={selectedFlower} onSelectFlower={setSelectedFlower} disabled={isLoading} />
        
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-purple-300">3. Add a Creative Touch (Optional)</h2>
            <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g., 'a brave warrior with a gentle heart', 'a scholar who reads starlight', 'wearing modern street fashion'"
                className="w-full h-28 p-4 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 focus:border-purple-400 transition-all"
                disabled={isLoading}
            />
        </div>

        <div className="text-center">
            <button
                onClick={handleGenerate}
                disabled={!selectedFlower || !uploadedImage || isLoading}
                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50"
            >
                Bloom Your Character
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-fixed" style={{backgroundImage: 'radial-gradient(circle at top right, rgba(192, 132, 252, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(244, 114, 182, 0.1), transparent 50%)'}}>
      <Header />
      <main className="container mx-auto py-8">
        {error && (
            <div className="w-full max-w-4xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-center">
                <p>{error}</p>
            </div>
        )}
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
