"use client";

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen = ({ onStart, highScore }: StartScreenProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-y-auto overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-8 pb-20 max-w-2xl w-full">
        {/* Title */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-2 md:mb-4 animate-pulse-fast">
            TURBO
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            RACER
          </h2>
        </div>

        {/* Car Icon */}
        <div className="mb-4 md:mb-6">
          <div className="relative">
            <div className="w-24 h-36 bg-gradient-to-b from-red-500 to-red-700 rounded-lg shadow-2xl transform hover:scale-110 transition-transform">
              <div className="w-16 h-8 bg-gradient-to-b from-blue-300 to-blue-500 mx-auto mt-2 rounded"></div>
              <div className="absolute -left-2 top-8 w-4 h-8 bg-gray-900 rounded"></div>
              <div className="absolute -right-2 top-8 w-4 h-8 bg-gray-900 rounded"></div>
              <div className="absolute -left-2 bottom-8 w-4 h-8 bg-gray-900 rounded"></div>
              <div className="absolute -right-2 bottom-8 w-4 h-8 bg-gray-900 rounded"></div>
            </div>
          </div>
        </div>

        {/* High Score */}
        {highScore > 0 && (
          <div className="mb-4 md:mb-6 bg-black/40 backdrop-blur-md px-6 md:px-8 py-3 md:py-4 rounded-2xl border-2 border-yellow-400 shadow-xl">
            <div className="text-yellow-400 text-sm font-bold mb-1">HIGH SCORE</div>
            <div className="text-white text-3xl md:text-4xl font-black">{highScore}</div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative px-10 md:px-12 py-4 md:py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl md:text-2xl rounded-full shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-200 mb-6 md:mb-8"
        >
          <span className="relative z-10">START GAME</span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        {/* Instructions */}
        <div className="bg-black/30 backdrop-blur-sm px-6 md:px-8 py-5 md:py-6 rounded-2xl border border-white/20 shadow-xl max-w-md w-full mb-6">
          <h3 className="text-white font-bold text-lg md:text-xl mb-3 md:mb-4 text-center">How to Play</h3>
          <ul className="text-white/90 space-y-1.5 md:space-y-2 text-xs sm:text-sm md:text-base">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">🎮</span>
              <span><strong>Desktop:</strong> Arrow Keys or A/D • SPACE to pause</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">📱</span>
              <span><strong>Mobile:</strong> Touch and drag to steer</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">🚗</span>
              <span>Avoid cars and cones</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">💰</span>
              <span>Collect coins (+50 pts)</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">🛡</span>
              <span><strong>Shield:</strong> Protects from one crash</span>
            </li>
            <li className="flex items-start">
              <span className="text-pink-400 mr-2">🧲</span>
              <span><strong>Magnet:</strong> Attracts nearby coins</span>
            </li>
            <li className="flex items-start">
              <span className="text-lime-400 mr-2">⚡</span>
              <span><strong>Boost:</strong> Increases your speed</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-6 text-white/50 text-xs sm:text-sm text-center">
        Press START to begin your adventure
      </div>
    </div>
  );
};

export default StartScreen;
