"use client";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1589327329571-7024f0a7a402?q=80&w=1974&auto=format&fit=crop";

interface HomeScreenProps {
  onEnter: () => void;
}

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center text-white p-4"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      <div className="text-center bg-black/40 p-8 md:p-12 rounded-2xl backdrop-blur-md shadow-2xl max-w-lg w-full">
        <h1
          className="text-6xl md:text-8xl font-bold"
          style={{
            fontFamily: "var(--font-playfair), serif",
            color: "#FFD700",
            textShadow: "2px 2px 4px #000, 0 0 20px #000",
          }}
        >
          Bloom Me
        </h1>
        <p className="mt-4 text-base md:text-lg text-yellow-100 opacity-90">
          Reincarnate as a flower spirit from history&apos;s most beautiful eras.
        </p>
        <button
          onClick={onEnter}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300 w-full sm:w-auto"
        >
          Enter the Garden of Time
        </button>
        <p className="mt-4 text-xs text-gray-300">
          * Real-Image Quality requires a valid API Key.
        </p>
      </div>
    </div>
  );
}
