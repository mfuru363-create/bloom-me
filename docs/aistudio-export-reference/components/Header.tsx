
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 px-4 bg-gradient-to-b from-gray-900 to-transparent">
      <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 mb-2">
        Bloom Me
      </h1>
      <p className="text-lg text-gray-300">
        Transform flowers into captivating spirit characters with the magic of AI.
      </p>
    </header>
  );
};

export default Header;
